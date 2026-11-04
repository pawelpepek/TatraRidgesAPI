"""Pobiera polski NMT 1 m (GUGiK, WCS) w kaflach 1 km wzdłuż wszystkich grani z data/tatra-data.json
(pas CORRIDOR m po obu stronach prostej między punktami) i zapisuje je jako data/nmt/{x}_{y}.npy.

Kafle poza Polską przychodzą puste (same NaN) i też są zapisywane, żeby nie pobierać ich ponownie.
Opcjonalnie: download_nmt.py <katalog z kaflami .asc> — przenosi wcześniej pobrane kafle zamiast pobierać."""

import json
import math
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import requests
import truststore
from pyproj import Transformer

from config import CRS, NMT_DIR, PL_COVERAGE, PL_WCS, TATRA_DATA, TILE
from dem import asc_to_array

# geoportal.gov.pl nie wysyła certyfikatu pośredniego; magazyn systemu go uzupełnia
truststore.inject_into_ssl()

CORRIDOR = 300  # m
WORKERS = 4


def needed_tiles():
    data = json.loads(TATRA_DATA.read_text(encoding="utf-8"))
    to_pl = Transformer.from_crs("EPSG:4326", CRS, always_xy=True)
    xy = {p["id"]: to_pl.transform(p["lng"], p["lat"]) for p in data["points"]}
    tiles = set()
    for r in data["ridges"]:
        (x1, y1), (x2, y2) = xy[r["pointId1"]], xy[r["pointId2"]]
        steps = max(1, int(math.hypot(x2 - x1, y2 - y1) / 100))
        for i in range(steps + 1):
            x = x1 + (x2 - x1) * i / steps
            y = y1 + (y2 - y1) * i / steps
            for dx in (-CORRIDOR, 0, CORRIDOR):
                for dy in (-CORRIDOR, 0, CORRIDOR):
                    tiles.add((int((x + dx) // TILE * TILE), int((y + dy) // TILE * TILE)))
    return sorted(tiles)


def fetch(x, y):
    path = NMT_DIR / f"{x}_{y}.npy"
    params = {
        "SERVICE": "WCS",
        "VERSION": "1.0.0",
        "REQUEST": "GetCoverage",
        "COVERAGE": PL_COVERAGE,
        "CRS": CRS,
        "BBOX": f"{x},{y},{x + TILE},{y + TILE}",
        "WIDTH": TILE,
        "HEIGHT": TILE,
        "FORMAT": "image/x-aaigrid",
    }
    for attempt in range(4):
        try:
            r = requests.get(PL_WCS, params=params, timeout=180)
            if r.ok and r.content.startswith(b"ncols"):
                a = asc_to_array(r.content)
                np.save(path, a)
                return f"ok {path.name} ({(~np.isnan(a)).mean():.0%} danych)"
            error = f"{r.status_code} {r.content[:120]!r}"
        except requests.RequestException as e:
            error = str(e)
        time.sleep(5 * (attempt + 1))
    return f"błąd {path.name}: {error}"


def import_asc(directory):
    count = 0
    for path in Path(directory).glob("*.asc"):
        target = NMT_DIR / f"{path.stem}.npy"
        if not target.exists():
            np.save(target, asc_to_array(path.read_bytes()))
            count += 1
    print(f"przeniesione kafle: {count}")


def main():
    NMT_DIR.mkdir(parents=True, exist_ok=True)
    if len(sys.argv) > 1:
        for directory in sys.argv[1:]:
            import_asc(directory)
        return
    todo = [(x, y) for x, y in needed_tiles() if not (NMT_DIR / f"{x}_{y}.npy").exists()]
    print(f"do pobrania: {len(todo)} kafli")
    with ThreadPoolExecutor(WORKERS) as pool:
        for line in pool.map(lambda t: fetch(*t), todo):
            print(line, flush=True)


if __name__ == "__main__":
    main()
