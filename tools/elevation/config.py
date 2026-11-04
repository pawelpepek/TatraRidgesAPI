"""Wspólne ustawienia: układ, ścieżki, źródła danych."""

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
POINTS = DATA / "points.json"
RIDGES = DATA / "ridges.json"
PREVIEW = ROOT / "preview"
