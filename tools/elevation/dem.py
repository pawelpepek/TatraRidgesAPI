"""Model terenu z kafli 1 km czytany oknami, bez sklejania całości w pamięci."""

import io
import math
from functools import lru_cache

import numpy as np

from config import NMT_DIR, TILE


def asc_to_array(content):
    """Kafel ASC z GUGiK: 5 wierszy nagłówka, potem wiersze od północy; poza Polską same zera."""
    a = np.loadtxt(io.BytesIO(content), skiprows=5, dtype=np.float32)
    a[a == 0] = np.nan
    return a


@lru_cache(maxsize=64)
def tile(x, y):
    path = NMT_DIR / f"{x}_{y}.npy"
    return np.load(path) if path.exists() else None


class Window:
    """Prostokąt modelu terenu: z[row, col], wiersz 0 na północy; x0, y1 to lewy górny róg w metrach."""

    def __init__(self, z, x0, y1):
        self.z = z
        self.x0 = x0
        self.y1 = y1

    def cell(self, x, y):
        return int(math.floor(self.y1 - y)), int(math.floor(x - self.x0))

    def xy(self, row, col):
        return self.x0 + col + 0.5, self.y1 - row - 0.5

    def inside(self, row, col):
        h, w = self.z.shape
        return 0 <= row < h and 0 <= col < w and not np.isnan(self.z[row, col])


def read(x0, y0, x1, y1):
    """Okno [x0, x1) × [y0, y1) w pełnych metrach; braki danych to NaN."""
    x0, y0, x1, y1 = (int(math.floor(v)) for v in (x0, y0, x1, y1))
    z = np.full((y1 - y0, x1 - x0), np.nan, dtype=np.float32)
    for tx in range(x0 // TILE * TILE, x1, TILE):
        for ty in range(y0 // TILE * TILE, y1, TILE):
            t = tile(tx, ty)
            if t is None:
                continue
            # Część wspólna kafla i okna
            ax0, ax1 = max(x0, tx), min(x1, tx + TILE)
            ay0, ay1 = max(y0, ty), min(y1, ty + TILE)
            if ax0 >= ax1 or ay0 >= ay1:
                continue
            z[y1 - ay1 : y1 - ay0, ax0 - x0 : ax1 - x0] = t[ty + TILE - ay1 : ty + TILE - ay0, ax0 - tx : ax1 - tx]
    return Window(z, x0, y1)
