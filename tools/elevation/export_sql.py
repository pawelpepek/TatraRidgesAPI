"""Zapisuje wynik analyze.py jako SQL dla bazy (data/ridge-geometry.sql): złagodzoną linię i profil każdej grani
w kolumnach "Line" i "Profile" tabeli "PointsConnections" (migracja 20261104120000_ridge_geometry).

- "Line": wierzchołki linii po uproszczeniu Douglasa–Peuckera z tolerancją LINE_SMOOTHING m, [[lat, lng], ...]
  od PointId1 do PointId2; aplikacja zaokrągla narożniki przy rysowaniu (ROUNDING_STEPS razy, jak tu).
- "Profile": wysokości z modelu terenu w pełnych metrach co PROFILE_STEP m wzdłuż dokładnej grani od PointId1.

Linia nigdy nie zawraca: każdy jej wierzchołek leży, licząc wzdłuż prostej między punktami, dalej niż poprzedni.
Taka linia nie robi haczyków przy punktach ani pętli, a zaokrąglanie tego nie psuje. Linie, które po zaokrągleniu
przecinają inną grań (poza wspólnym punktem), zostają prostymi.

Grań dostaje dane tylko wtedy, gdy oba jej punkty leżą tam, gdzie leżały przy liczeniu (inaczej linia by nie
pasowała). Plik uruchamia się w edytorze SQL Supabase albo przez psql."""

import json

import numpy as np
from pyproj import Transformer
from shapely.geometry import LineString
from shapely.strtree import STRtree
from skimage.measure import approximate_polygon

from analyze import PROFILE_STEP
from config import CRS, DATA, RIDGES, load_tatra_data

LINE_SMOOTHING = 25  # m, wybrane na podglądzie
ROUNDING_STEPS = 4  # jak ROUNDING_STEPS w TatraRidges.FrontEnd/src/store/ridge-geometry.ts
MIN_PROGRESS = 2  # m: o tyle co najmniej kolejny wierzchołek musi być dalej wzdłuż prostej
MAX_TURN = 90  # stopni: ostrzejszy skręt na wierzchołku linii usuwa ten wierzchołek
OUTPUT = DATA / "ridge-geometry.sql"

to_pl = Transformer.from_crs("EPSG:4326", CRS, always_xy=True)
to_wgs = Transformer.from_crs(CRS, "EPSG:4326", always_xy=True)


def forward_only(xy):
    """Zostawia wierzchołki, które posuwają się wzdłuż prostej od pierwszego do ostatniego punktu."""
    a, b = xy[0], xy[-1]
    chord = b - a
    length = float(np.hypot(*chord))
    if length == 0:
        return np.array([a, b])
    kept, last = [a], 0.0
    for v in xy[1:-1]:
        along = float(np.dot(v - a, chord)) / length
        if last + MIN_PROGRESS <= along <= length - MIN_PROGRESS:
            kept.append(v)
            last = along
    kept.append(b)
    return np.array(kept)


def no_sharp_turns(xy):
    """Usuwa wierzchołki, na których linia skręca o więcej niż MAX_TURN stopni. Ostry zwrot tuż przy punkcie
    po zaokrągleniu wygląda jak haczyk z boku punktu, którego forward_only nie wyłapuje (Świstowy Róg)."""
    pts = list(xy)
    changed = True
    while changed and len(pts) > 2:
        changed = False
        for k in range(1, len(pts) - 1):
            u, w = pts[k] - pts[k - 1], pts[k + 1] - pts[k]
            cos = float(np.dot(u, w)) / (float(np.hypot(*u)) * float(np.hypot(*w)) or 1)
            if cos < np.cos(np.radians(MAX_TURN)):
                del pts[k]
                changed = True
                break
    return np.array(pts)


def rounded(xy, steps=ROUNDING_STEPS):
    """Zaokrąglanie Chaikina, takie samo jak w aplikacji; końce zostają."""
    pts = [np.asarray(p, dtype=float) for p in xy]
    for _ in range(steps):
        if len(pts) < 3:
            break
        out = [pts[0]]
        for k in range(len(pts) - 1):
            if k > 0:
                out.append(0.75 * pts[k] + 0.25 * pts[k + 1])
            if k < len(pts) - 2:
                out.append(0.25 * pts[k] + 0.75 * pts[k + 1])
        out.append(pts[-1])
        pts = out
    return np.array(pts)


def to_latlng(xy, p1, p2):
    out = []
    for x, y in xy:
        lng, lat = to_wgs.transform(x, y)
        out.append([round(lat, 6), round(lng, 6)])
    # Końce dokładnie we współrzędnych punktów z bazy: aplikacja po nich rozpoznaje, że linia pasuje
    out[0], out[-1] = [p1["lat"], p1["lng"]], [p2["lat"], p2["lng"]]
    return out


def smoothed(line):
    xy = np.array([to_pl.transform(lng, lat) for lat, lng in line])
    return no_sharp_turns(forward_only(approximate_polygon(xy, tolerance=LINE_SMOOTHING)))


def crossing(shapes, ends):
    """Pary grani, których linie przecinają się gdzie indziej niż we wspólnym punkcie."""
    ids = list(shapes)
    tree = STRtree([shapes[i] for i in ids])
    pairs = set()
    for i, rid in enumerate(ids):
        for j in tree.query(shapes[rid], predicate="intersects"):
            other = ids[j]
            if other <= rid:
                continue
            common = ends[rid] & ends[other]
            touch = shapes[rid].intersection(shapes[other])
            # Wspólny punkt końcowy nie jest przecięciem; wszystko poza nim jest
            if common and touch.geom_type == "Point":
                continue
            pairs.add((rid, other))
    return pairs


def main():
    data = load_tatra_data()
    points = {p["id"]: p for p in data["points"]}
    names = {p["id"]: p["name"] for p in data["points"]}
    ridges = json.loads(RIDGES.read_text(encoding="utf-8"))
    assert all(r["profileStep"] == PROFILE_STEP for r in ridges)

    # Linie wszystkich grani w metrach: złagodzone tam, gdzie są dane, proste gdzie indziej
    xy_of = lambda pid: np.array(to_pl.transform(points[pid]["lng"], points[pid]["lat"]))
    lines = {r["id"]: smoothed(r["line"]) for r in ridges}
    ends = {r["id"]: {r["pointId1"], r["pointId2"]} for r in data["ridges"]}
    shapes = {
        r["id"]: LineString(rounded(lines[r["id"]]) if r["id"] in lines else [xy_of(r["pointId1"]), xy_of(r["pointId2"])])
        for r in data["ridges"]
    }
    straightened = set()
    while pairs := {p for p in crossing(shapes, ends) if p[0] in lines or p[1] in lines}:
        for pair in pairs:
            for rid in pair:
                if rid in lines and len(lines[rid]) > 2:
                    lines[rid] = lines[rid][[0, -1]]
                    shapes[rid] = LineString(lines[rid])
                    straightened.add(rid)
        if not any(len(lines[rid]) > 2 for pair in pairs for rid in pair if rid in lines):
            break  # zostały przecięcia samych prostych: tak są w bazie, nie zmieniamy ich

    sql = [
        "-- Wygenerowane przez tools/elevation/export_sql.py; linie i profile grani z NMT GUGiK.",
        "begin;",
    ]
    vertices = 0
    for r in ridges:
        p1, p2 = points[r["pointId1"]], points[r["pointId2"]]
        line = to_latlng(lines[r["id"]], p1, p2)
        vertices += len(line)
        profile = ",".join(str(round(v)) for v in r["z"])
        sql.append(
            f'update public."PointsConnections" c set "Line" = \'{json.dumps(line)}\'::jsonb, '
            f'"Profile" = \'{{{profile}}}\'::smallint[] '
            f'where c."Id" = {r["id"]} and c."PointId1" = {p1["id"]} and c."PointId2" = {p2["id"]} '
            f'and exists (select 1 from public."MountainPoints" p where p."Id" = {p1["id"]} '
            f'and p."Latitude" = {p1["lat"]} and p."Longitude" = {p1["lng"]}) '
            f'and exists (select 1 from public."MountainPoints" p where p."Id" = {p2["id"]} '
            f'and p."Latitude" = {p2["lat"]} and p."Longitude" = {p2["lng"]});'
        )
    sql.append("commit;")
    OUTPUT.write_text("\n".join(sql) + "\n", encoding="utf-8")
    print(f"{OUTPUT.name}: {len(ridges)} grani, {vertices} wierzchołków linii, {OUTPUT.stat().st_size // 1024} KB")
    for rid in sorted(straightened):
        r = next(r for r in ridges if r["id"] == rid)
        print(f"  prosta zamiast łuku (przecinała inną grań): {names[r['pointId1']]} – {names[r['pointId2']]}")


if __name__ == "__main__":
    main()
