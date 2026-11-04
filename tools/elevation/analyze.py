"""Dopasowuje punkty do modelu terenu i wyznacza linie grani z profilami.

1. Szczyty: wspinaczka po wygładzonym modelu od położenia z bazy do najbliższego wierzchołka.
2. Grań: najtańsza ścieżka po modelu, tania na grzbiecie (wzniesienie nad otoczeniem w kilku skalach),
   droga na zboczu, w żlebie i wyraźnie poniżej niższego z końców.
3. Przełęcze: wcięcie grani między sąsiadami przełęczy, bliskie jej położeniu i wysokości z bazy.
4. Linia grani między ostatecznymi położeniami punktów, dopasowana tak, żeby jej końce trafiały w punkty z bazy
   (przesunięcie, obrót i skala), bez schodków siatki 1 m; profil z modelu co PROFILE_STEP m.

Każdy krok czyta tylko okno modelu wokół punktu albo grani. Wynik: data/points.json, data/ridges.json.
"""

import json
import math

import numpy as np
from pyproj import Transformer
from scipy import ndimage
from skimage.graph import route_through_array
from skimage.measure import approximate_polygon

import dem
from config import CRS, POINTS, RIDGES, TATRA_DATA

SUMMIT = 1
SUMMIT_MAX_SHIFT = 80  # m
PASS_SEARCH = 80  # m
NOTCH_WINDOW = 8  # komórek ścieżki (ok. 8–11 m) po obu stronach
PASS_HEIGHT_WEIGHT = 3  # metr różnicy wysokości waży tyle co 3 m odległości
TPI_RADII = (10, 30, 60)  # m
TPI_GAIN = 12.0  # grań o zboczach 45° ma grzbietowość ok. 0,5, czyli koszt e^-4
LENGTH_COST = 0.1  # koszt metra niezależny od rzeźby (grań ostra kosztuje ok. 0,02, zbocze ok. 1)
CORRIDOR = 150  # m wokół prostej między końcami grani
BELOW_ENDS_MARGIN = 5  # m poniżej niższego końca grani bez kary
BELOW_ENDS_SCALE = 8  # m: co tyle metrów niżej koszt rośnie e razy (do e^6)
EDGE_WARNING = 15  # m: część grani bliżej braku danych jest niepewna
PROFILE_STEP = 2  # m
LINE_TOLERANCE = 1.0  # m: usuwa schodki siatki, zakręty grani zostają

# Progi oznaczania grani do przejrzenia
REVIEW_RATIO = 1.4  # długość granią względem prostej
REVIEW_BELOW = 15  # m poniżej niższego końca
REVIEW_EDGE = 0.2  # udział grani przy braku danych

to_pl = Transformer.from_crs("EPSG:4326", CRS, always_xy=True)
to_wgs = Transformer.from_crs(CRS, "EPSG:4326", always_xy=True)


def filled(z):
    """Braki wypełnione najbliższą wysokością, żeby filtry nie rozlewały NaN."""
    missing = np.isnan(z)
    if not missing.any():
        return z
    if missing.all():
        return np.zeros_like(z)
    nearest = ndimage.distance_transform_edt(missing, return_distances=False, return_indices=True)
    return z[tuple(nearest)]


def ridge_cost(z):
    """Grzbietowość: wzniesienie nad średnią otoczenia w kilku skalach, podzielone przez promień.
    Wcięcie między turniami jest niżej niż jego bliskie otoczenie, ale wyżej niż doliny dalej,
    więc bierzemy największą wartość ze skal; na równym stoku wszystkie są bliskie zera."""
    f = filled(z).astype(np.float64)
    ridgeness = np.full(f.shape, -np.inf)
    for radius in TPI_RADII:
        ridgeness = np.maximum(ridgeness, (f - ndimage.uniform_filter(f, 2 * radius + 1)) / radius)
    # Stały koszt metra: na szerokim, zaokrąglonym grzbiecie grzbietowość słabo odróżnia grań od zbocza
    # i bez niego ścieżka robi objazdy do każdej ostrzejszej formy
    cost = np.exp(np.clip(-ridgeness * TPI_GAIN, -4, 4)) + LENGTH_COST
    cost[np.isnan(z)] = 1e6
    return cost


def ridge_path(a, b):
    """Najtańsza ścieżka między punktami a i b (x, y w PL-1992). Zwraca okno i listę komórek albo None."""
    margin = CORRIDOR + max(TPI_RADII)
    win = dem.read(
        min(a[0], b[0]) - margin, min(a[1], b[1]) - margin, max(a[0], b[0]) + margin, max(a[1], b[1]) + margin
    )
    ca, cb = win.cell(*a), win.cell(*b)
    if not (win.inside(*ca) and win.inside(*cb)):
        return None
    cost = ridge_cost(win.z)
    # Grań między sąsiednimi punktami nie schodzi wyraźnie niżej niż niższy z nich; bez tej kary na stromej
    # grani pod dużym szczytem ścieżka potrafi zejść żebrem lub żlebem i wrócić
    floor = min(win.z[ca], win.z[cb]) - BELOW_ENDS_MARGIN
    below = np.nan_to_num(floor - win.z, nan=0.0)
    cost = cost * np.exp(np.clip(below / BELOW_ENDS_SCALE, 0, 6))
    path, _ = route_through_array(cost, ca, cb, fully_connected=True, geometric=True)
    return win, path


def climb(p):
    """Wspinaczka po wygładzonym modelu do najbliższego wierzchołka; potem najwyższa surowa komórka w promieniu 3 m."""
    r = SUMMIT_MAX_SHIFT + 10
    win = dem.read(p[0] - r, p[1] - r, p[0] + r, p[1] + r)
    row, col = r0, c0 = win.cell(*p)
    if not win.inside(row, col):
        return None
    smooth = ndimage.gaussian_filter(filled(win.z), 1.5)
    while True:
        window = smooth[row - 1 : row + 2, col - 1 : col + 2]
        dr, dc = np.unravel_index(np.argmax(window), window.shape)
        if (dr, dc) == (1, 1):
            break
        row, col = row + dr - 1, col + dc - 1
        if math.hypot(row - r0, col - c0) > SUMMIT_MAX_SHIFT:
            return None
    window = np.nan_to_num(win.z[row - 3 : row + 4, col - 3 : col + 4], nan=-1e9)
    dr, dc = np.unravel_index(np.argmax(window), window.shape)
    return win.xy(row + dr - 3, col + dc - 3), float(win.z[row + dr - 3, col + dc - 3])


def find_pass(p, a, b):
    """Wcięcie grani między sąsiadami a i b. Na poszarpanej grani w promieniu PASS_SEARCH bywa kilka przełączek,
    więc wybieramy bliskie i o wysokości bliskiej tej z bazy."""
    found = ridge_path(a, b)
    if not found:
        return None
    win, path = found
    z = [float(win.z[c]) for c in path]
    notches = []
    for i, c in enumerate(path):
        x, y = win.xy(*c)
        d = math.hypot(x - p["xy"][0], y - p["xy"][1])
        if d <= PASS_SEARCH and z[i] == min(z[max(0, i - NOTCH_WINDOW) : i + NOTCH_WINDOW + 1]):
            notches.append((d + PASS_HEIGHT_WEIGHT * abs(z[i] - (p["evaluation"] or z[i])), (x, y), z[i]))
    if not notches:
        return None
    _, xy, z_best = min(notches)
    return xy, z_best


def anchored(points, a, b, a_new, b_new):
    """Przekształcenie przez podobieństwo (przesunięcie, obrót, skala), które przenosi a na a_new i b na b_new."""
    za, zb, wa, wb = (complex(*v) for v in (a, b, a_new, b_new))
    k = (wb - wa) / (zb - za) if zb != za else 1
    return [((wa + (complex(*q) - za) * k).real, (wa + (complex(*q) - za) * k).imag) for q in points]


def latlng(x, y):
    lng, lat = to_wgs.transform(x, y)
    return [round(lat, 6), round(lng, 6)]


def main():
    data = json.loads(TATRA_DATA.read_text(encoding="utf-8"))
    points = {p["id"]: {**p, "xy": to_pl.transform(p["lng"], p["lat"])} for p in data["points"]}

    neighbours = {pid: [] for pid in points}
    for r in data["ridges"]:
        neighbours[r["pointId1"]].append(r["pointId2"])
        neighbours[r["pointId2"]].append(r["pointId1"])

    # 1. Szczyty
    for p in points.values():
        p["lidar"], p["zLidar"], p["note"] = None, None, None
        win = dem.read(p["xy"][0] - 1, p["xy"][1] - 1, p["xy"][0] + 2, p["xy"][1] + 2)
        p["covered"] = not np.isnan(win.z[1, 1])
        if p["covered"] and p["pointTypeId"] == SUMMIT:
            top = climb(p["xy"])
            if top:
                p["lidar"], p["zLidar"] = top
            else:
                p["note"] = f"brak wierzchołka w promieniu {SUMMIT_MAX_SHIFT} m"

    def anchor(pid):
        return points[pid]["lidar"] or points[pid]["xy"]

    # 3. Przełęcze
    for p in points.values():
        if not p["covered"] or p["pointTypeId"] == SUMMIT:
            continue
        nb = neighbours[p["id"]]
        if len(nb) != 2:
            p["note"] = f"{len(nb)} sąsiadów na grani, położenie bez zmian"
            continue
        found = find_pass(p, anchor(nb[0]), anchor(nb[1]))
        if found:
            p["lidar"], p["zLidar"] = found
        else:
            p["note"] = "brak wcięcia grani w pobliżu przełęczy"
    print("punkty gotowe", flush=True)

    # 2. i 4. Granie
    out_ridges, skipped = [], 0
    for n, r in enumerate(data["ridges"], 1):
        p1, p2 = points[r["pointId1"]], points[r["pointId2"]]
        if not (p1["covered"] and p2["covered"]):
            skipped += 1
            continue
        a, b = anchor(p1["id"]), anchor(p2["id"])
        found = ridge_path(a, b)
        if not found:
            skipped += 1
            continue
        win, path = found
        # Środki komórek, ale końce dokładnie w punktach (komórka końca jest przesunięta o ułamek metra)
        xy = [a] + [win.xy(*c) for c in path[1:-1]] + [b]
        z = np.array([win.z[c] for c in path], dtype=np.float64)
        steps = np.hypot(np.diff([q[0] for q in xy]), np.diff([q[1] for q in xy]))
        dist = np.concatenate([[0], np.cumsum(steps)])
        length = float(dist[-1])
        straight = math.hypot(b[0] - a[0], b[1] - a[1])
        missing = np.isnan(win.z)
        edge = ndimage.distance_transform_edt(~missing) if missing.any() else None

        # Profil co PROFILE_STEP m
        samples = np.arange(0, length + 1e-9, PROFILE_STEP)
        if samples[-1] < length:
            samples = np.append(samples, length)
        profile = np.interp(samples, dist, z)

        # Linia: końce w punktach z bazy, bez schodków siatki
        line = anchored(xy, a, b, p1["xy"], p2["xy"])
        line = approximate_polygon(np.array(line), tolerance=LINE_TOLERANCE)

        below = max(0.0, float(min(z[0], z[-1]) - z.min()))
        near_edge = float(np.mean([edge[c] < EDGE_WARNING for c in path])) if edge is not None else 0.0
        reasons = []
        if straight > 30 and length / straight > REVIEW_RATIO:
            reasons.append(f"granią {length / straight:.1f}× dłużej niż prosto")
        if below > REVIEW_BELOW:
            reasons.append(f"schodzi {below:.0f} m poniżej niższego końca")
        if near_edge > REVIEW_EDGE:
            reasons.append(f"{near_edge:.0%} przy braku danych")
        out_ridges.append(
            {
                "id": r["id"],
                "pointId1": r["pointId1"],
                "pointId2": r["pointId2"],
                "routeTypes": sorted({route["routeTypeId"] for route in r["routes"]}),
                "length": round(length, 1),
                "straight": round(straight, 1),
                "review": reasons,
                "line": [latlng(x, y) for x, y in line],
                "profileStep": PROFILE_STEP,
                "z": [round(float(v), 1) for v in profile],
            }
        )
        if n % 50 == 0:
            print(f"granie: {n}/{len(data['ridges'])}", flush=True)

    out_points = []
    for p in points.values():
        if not p["covered"]:
            continue
        item = {
            "id": p["id"],
            "name": p["name"],
            "type": p["pointTypeId"],
            "evaluation": p["evaluation"],
            "current": [p["lat"], p["lng"]],
            "note": p["note"],
        }
        if p["lidar"]:
            item |= {
                "lidar": latlng(*p["lidar"]),
                "zLidar": round(p["zLidar"], 1),
                "dz": round(p["zLidar"] - p["evaluation"], 1) if p["evaluation"] is not None else None,
                "shift": round(math.hypot(p["lidar"][0] - p["xy"][0], p["lidar"][1] - p["xy"][1]), 1),
            }
        out_points.append(item)

    POINTS.write_text(json.dumps(out_points, ensure_ascii=False), encoding="utf-8")
    RIDGES.write_text(json.dumps(out_ridges, ensure_ascii=False), encoding="utf-8")

    snapped = sorted(p["shift"] for p in out_points if "shift" in p)
    review = [r for r in out_ridges if r["review"]]
    print(f"punkty z danymi: {len(out_points)} z {len(points)}, dopasowane: {len(snapped)}")
    if snapped:
        print(f"przesunięcie: mediana {snapped[len(snapped) // 2]} m, maks. {snapped[-1]} m")
    print(f"granie: {len(out_ridges)} policzone, {skipped} bez danych, {len(review)} do przejrzenia")


if __name__ == "__main__":
    main()
