"""Szczyty i przełęcze Tatr z OpenStreetMap (data/osm-points.json, zapytanie w download_osm.py) jako wskazówka,
gdzie szukać formy terenu dla punktu, którego położenie w bazie jest ewidentnie złe. Dopasowanie po nazwie polskiej
(name, name:pl) albo słowackiej (AlternativeName z bazy wobec name, name:sk), w promieniu MAX_DISTANCE od punktu
(nazwy w Tatrach się powtarzają, więc dalszy obiekt o tej nazwie to raczej inna forma).
Samo położenie bierzemy potem z modelu terenu, nie z OSM."""

import json
import math
import unicodedata

from pyproj import Transformer

from config import CRS, OSM_POINTS

MAX_DISTANCE = 350  # m: ta sama nazwa dalej to raczej inna forma (Palec, Zbójnicki Kopiniak: 600–1350 m)
SUMMIT, PASS = 1, 2

to_pl = Transformer.from_crs("EPSG:4326", CRS, always_xy=True)


def normalize(name):
    name = unicodedata.normalize("NFKD", name.casefold())
    return " ".join("".join(c for c in name if not unicodedata.combining(c)).replace("-", " ").split())


def load():
    """Lista (typ, {znormalizowane nazwy}, (x, y)) w PL-1992; typ SUMMIT dla szczytów, PASS dla przełęczy."""
    if not OSM_POINTS.exists():
        return []
    out = []
    for e in json.loads(OSM_POINTS.read_text(encoding="utf-8"))["elements"]:
        tags = e.get("tags", {})
        names = {normalize(tags[k]) for k in ("name", "name:pl", "name:sk") if tags.get(k)}
        if names:
            kind = SUMMIT if tags.get("natural") == "peak" else PASS
            out.append((kind, names, to_pl.transform(e["lon"], e["lat"])))
    return out


def find(osm, point, xy):
    """Położenie (x, y) obiektu OSM o nazwie punktu i tym samym rodzaju, najbliższego punktowi; None, gdy brak."""
    names = {normalize(n) for n in (point["name"], point.get("altName")) if n}
    matches = [
        (math.dist(xy, pos), pos)
        for kind, osm_names, pos in osm
        if kind == point["pointTypeId"] and names & osm_names and math.dist(xy, pos) <= MAX_DISTANCE
    ]
    return min(matches)[1] if matches else None
