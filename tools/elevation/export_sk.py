"""Zamawia wycinek słowackiego modelu terenu (DMR, ÚGKK SR) w eksporcie aplikacji MAPKA dla wielokąta
z data/sk-export-polygon.geojson (otoczka słowackich grani, ok. 200 km², limit eksportu 400 km²).

To samo, co MAPKA → Terén → Export → „ohradou”: serwer przygotowuje TIFF w S-JTSK(JTSK03) z wysokościami Bpv
i przysyła link na podany e-mail. Licencja: CC BY 4.0, źródło „Zdroj produktov LLS: ÚGKK SR”.

Użycie: export_sk.py check            — tylko sprawdza, czy dla wielokąta są dane (DMR5, DMR6)
        export_sk.py DMR5 <e-mail>    — zamawia eksport"""

import json
import sys

import requests
import truststore
from pyproj import Transformer

from config import DATA

truststore.inject_into_ssl()

API = "https://zbgis.skgeodesy.sk/mapka/api/export"
POLYGON = DATA / "sk-export-polygon.geojson"
DATA_USE = 3  # „analýzy terénu” z listy celów użycia w formularzu

to_mercator = Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True)


def esri_rings(geometry):
    """Pierścienie wielokąta w układzie mapy (Web Mercator), zewnętrzny zgodnie z ruchem wskazówek zegara."""
    rings = []
    for k, ring in enumerate(geometry["coordinates"]):
        xy = [list(to_mercator.transform(lng, lat)) for lng, lat in ring]
        area = sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(xy, xy[1:] + xy[:1]))
        clockwise = area <= 0
        if (k == 0) != clockwise:
            xy.reverse()
        rings.append(xy)
    return rings


def main():
    geometry = json.loads(POLYGON.read_text())["geometry"]
    rings = esri_rings(geometry)
    if sys.argv[1:2] == ["check"]:
        r = requests.post(f"{API}/checkAvailability", json={"esriGeometryPolygon": {"rings": rings}}, timeout=60)
        print(r.status_code, r.text[:500])
        return
    version, email = sys.argv[1], sys.argv[2]
    lngs = [lng for lng, _ in geometry["coordinates"][0]]
    lats = [lat for _, lat in geometry["coordinates"][0]]
    body = {
        "email": email,
        "format": "TIFF",
        "dataUse": DATA_USE,
        "service": "ExportDMR",
        "version": version,
        "outputCrs": "S-JTSK(JTSK03)",
        "extent": {"coordinates": [[min(lngs), min(lats)], [max(lngs), max(lats)]], "type": "envelope"},
        "esriGeometry": {"geometryType": "esriGeometryPolygon", "features": [{"geometry": {"rings": rings}}]},
    }
    r = requests.post(f"{API}/dmr", json=body, timeout=120)
    print(r.status_code, r.text[:500])


if __name__ == "__main__":
    main()
