"""Przelicza słowacki DMR 5.0 z eksportu MAPKA (data/sk/*.tif albo *.zip z TIFF-ami; S-JTSK(JTSK03) EPSG:8353,
wysokości Bpv) na kafle 1 km w PL-1992 (data/nmt-sk/{x}_{y}.npy), takie jak kafle polskiego NMT.

Wysokości: Bpv i polski EVRF2007 różnią się o decymetry. Różnicę mierzymy na pasie, gdzie są oba modele
(polski NMT sięga trochę za granicę), i jeśli przekracza SHIFT_THRESHOLD, przesuwamy słowackie wysokości o medianę."""

import zipfile

import numpy as np
import rasterio
from rasterio.crs import CRS
from rasterio.enums import Resampling
from rasterio.transform import from_origin
from rasterio.warp import reproject, transform_bounds
from rasterio.errors import WindowError
from rasterio.windows import Window, from_bounds

from config import CRS as TARGET_CRS
from config import NMT_DIR, NMT_SK_DIR, SK_SOURCE_DIR, TILE
from download_nmt import needed_tiles

SOURCE_CRS = "EPSG:8353"  # S-JTSK [JTSK03] / Krovak East North, jeśli plik nie ma własnego układu
SHIFT_THRESHOLD = 0.1  # m


def sources():
    for z in SK_SOURCE_DIR.glob("*.zip"):
        target = SK_SOURCE_DIR / z.stem
        if not target.exists():
            with zipfile.ZipFile(z) as archive:
                archive.extractall(target)
    return sorted(p for p in SK_SOURCE_DIR.rglob("*") if p.suffix.lower() in (".tif", ".tiff"))


def warp_tile(sources, x, y):
    """Kafel [x, x+TILE) × [y, y+TILE) na siatce 1 m PL-1992 ze wszystkich źródeł; NaN poza danymi.
    GDAL czyta ze źródła tylko potrzebny fragment."""
    out = np.full((TILE, TILE), np.nan, dtype=np.float32)
    for ds, crs, bounds in sources:
        if bounds[2] <= x or bounds[0] >= x + TILE or bounds[3] <= y or bounds[1] >= y + TILE:
            continue
        # Fragment źródła pod kaflem (z zapasem na interpolację), czytany jako tablica: przy czytaniu wprost
        # z pliku GDAL bierze układ z pliku, a ten bywa niepełny
        src_bounds = transform_bounds(TARGET_CRS, crs, x, y, x + TILE, y + TILE)
        window = from_bounds(*src_bounds, ds.transform).round_offsets().round_lengths()
        try:
            window = Window(window.col_off - 3, window.row_off - 3, window.width + 6, window.height + 6).intersection(
                Window(0, 0, ds.width, ds.height)
            )
        except WindowError:
            continue  # kafel poza plikiem
        data = ds.read(1, window=window)
        part = np.full((TILE, TILE), np.nan, dtype=np.float32)
        reproject(
            source=data,
            destination=part,
            src_transform=ds.window_transform(window),
            src_crs=crs,
            src_nodata=ds.nodata,
            dst_transform=from_origin(x, y + TILE, 1, 1),
            dst_crs=TARGET_CRS,
            dst_nodata=np.nan,
            resampling=Resampling.bilinear,
        )
        part[(part < -1000) | (part > 10000)] = np.nan  # braki zapisane jako skrajne wartości (np. 3,4·10³⁸)
        fill = np.isnan(out) & ~np.isnan(part)
        out[fill] = part[fill]
    return out


def main():
    NMT_SK_DIR.mkdir(parents=True, exist_ok=True)
    paths = sources()
    if not paths:
        raise SystemExit(f"Brak plików TIFF w {SK_SOURCE_DIR}")
    sources_ = []
    for p in paths:
        ds = rasterio.open(p)
        # Eksport MAPKA zapisuje układ jako lokalny (LOCAL_CS) z kodem EPSG:8353, bez definicji, z której PROJ
        # umiałby przeliczyć współrzędne; wtedy bierzemy pełną definicję EPSG:8353
        crs = ds.crs if ds.crs is not None and ds.crs.is_projected else CRS.from_string(SOURCE_CRS)
        print(f"źródło: {ds.name}, {ds.width}×{ds.height}, {crs}, nodata {ds.nodata}")
        sources_.append((ds, crs, transform_bounds(crs, TARGET_CRS, *ds.bounds)))

    tiles = {}
    for x, y in needed_tiles():
        z = warp_tile(sources_, x, y)
        if not np.isnan(z).all():
            tiles[(x, y)] = z

    # Różnica wysokości na wspólnym pasie (słowacki − polski)
    diffs = []
    for (x, y), z in tiles.items():
        pl = NMT_DIR / f"{x}_{y}.npy"
        if pl.exists():
            z_pl = np.load(pl)
            both = ~np.isnan(z) & ~np.isnan(z_pl)
            # Tylko łagodny teren: na stromiznach drobne przesunięcie siatki daje duże różnice wysokości
            if both.sum() > 1000:
                gy, gx = np.gradient(np.where(np.isnan(z_pl), 0, z_pl))
                gentle = both & (np.hypot(gx, gy) < 0.3)
                diffs.append((z - z_pl)[gentle])
    shift = 0.0
    if diffs:
        d = np.concatenate(diffs)
        median = float(np.median(d))
        print(f"wspólny pas: {d.size} komórek, różnica SK − PL: mediana {median:+.2f} m, "
              f"kwartyle {np.percentile(d, 25):+.2f} / {np.percentile(d, 75):+.2f} m")
        if abs(median) > SHIFT_THRESHOLD:
            shift = -median
            print(f"słowackie wysokości przesunięte o {shift:+.2f} m")
    else:
        print("brak wspólnego pasa z polskim NMT, wysokości bez przesunięcia")

    for (x, y), z in tiles.items():
        np.save(NMT_SK_DIR / f"{x}_{y}.npy", z + np.float32(shift))
    print(f"kafle słowackie: {len(tiles)} w {NMT_SK_DIR}")


if __name__ == "__main__":
    main()
