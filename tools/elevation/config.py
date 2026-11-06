"""Wspólne ustawienia: układ, ścieżki, źródła danych."""

import json
from pathlib import Path

ROOT = Path(__file__).parent
DATA = ROOT / "data"

# Układ roboczy: PL-1992, natywny dla NMT GUGiK (siatka 1 m, kafle 1 km wyrównane do pełnych kilometrów)
CRS = "EPSG:2180"
TILE = 1000  # m

PL_WCS = "https://mapy.geoportal.gov.pl/wss/service/PZGIK/NMT/GRID1/WCS/DigitalTerrainModel"
PL_COVERAGE = "DTM_PL-EVRF2007-NH"

TATRA_DATA = DATA / "tatra-data.json"  # wynik get_tatra_data() z produkcji
NMT_DIR = DATA / "nmt"  # kafle {x}_{y}.npy (float32, NaN poza danymi), {x},{y} to lewy dolny róg
NMT_SK_DIR = DATA / "nmt-sk"  # to samo ze słowackiego DMR 5.0 (import_sk.py), używane tam, gdzie brak polskiego
SK_SOURCE_DIR = DATA / "sk"  # wycinki DMR 5.0 z eksportu MAPKA (*.tif albo *.zip z nimi)
CORRECTIONS = DATA / "point-corrections.json"  # {id: [lat, lng]} z correct_points.py
# Punkty ustawione ręcznie (w git): {id: {"name", "position": [lat, lng], "reason"}}. Wygrywają z poprawkami,
# a analyze.py nie szuka dla nich formy w modelu terenu, tylko przyjmuje ich położenie
MANUAL_POINTS = ROOT / "manual-points.json"
OSM_POINTS = DATA / "osm-points.json"  # szczyty i przełęcze z OpenStreetMap (download_osm.py)
POINTS = DATA / "points.json"
RIDGES = DATA / "ridges.json"
PREVIEW = ROOT / "preview"


def load_manual_points():
    return json.loads(MANUAL_POINTS.read_text(encoding="utf-8")) if MANUAL_POINTS.exists() else {}


def load_tatra_data():
    """Dane z produkcji z naniesionymi poprawkami położenia punktów (CORRECTIONS, potem MANUAL_POINTS); pierwotne
    współrzędne zostają w "originalLat"/"originalLng", bo po nich skrypty SQL poznają, że punkt w bazie nie był
    w międzyczasie ruszany. Punkty ustawione ręcznie mają "manual" = True."""
    data = json.loads(TATRA_DATA.read_text(encoding="utf-8"))
    corrections = json.loads(CORRECTIONS.read_text(encoding="utf-8")) if CORRECTIONS.exists() else {}
    manual = load_manual_points()
    for p in data["points"]:
        p["originalLat"], p["originalLng"] = p["lat"], p["lng"]
        if str(p["id"]) in corrections:
            p["lat"], p["lng"] = corrections[str(p["id"])]
        p["manual"] = str(p["id"]) in manual
        if p["manual"]:
            p["lat"], p["lng"] = manual[str(p["id"])]["position"]
    return data
