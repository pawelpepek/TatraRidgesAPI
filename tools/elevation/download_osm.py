"""Pobiera szczyty i przełęcze Tatr z OpenStreetMap (Overpass API) do data/osm-points.json (osm.py).
Publiczne serwery Overpass bywają przeciążone, więc próbujemy kilku po kolei, z przerwami."""

import time

import requests
import truststore

from config import OSM_POINTS

truststore.inject_into_ssl()

BBOX = "49.12,19.88,49.29,20.30"  # min lat, min lng, max lat, max lng
QUERY = (
    "[out:json][timeout:120];"
    f'(node["natural"~"^(peak|saddle)$"]({BBOX});node["mountain_pass"="yes"]({BBOX}););'
    "out body;"
)
SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]


def main():
    for attempt in range(3):
        for url in SERVERS:
            try:
                r = requests.post(url, data={"data": QUERY}, headers={"User-Agent": "graniowki-elevation-tools"}, timeout=180)
                if r.ok and r.text.lstrip().startswith("{"):
                    OSM_POINTS.write_text(r.text, encoding="utf-8")
                    print(f"{OSM_POINTS.name}: {len(r.json()['elements'])} obiektów z {url}")
                    return
                print(f"{url}: {r.status_code}")
            except requests.RequestException as e:
                print(f"{url}: {e}")
        time.sleep(15 * (attempt + 1))
    raise SystemExit("Żaden serwer Overpass nie odpowiedział")


if __name__ == "__main__":
    main()
