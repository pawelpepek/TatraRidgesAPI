"""Poprawki położenia punktów według modelu terenu (LIDAR): data/point-corrections.json dla analyze.py i export_sql.py
oraz data/point-corrections.sql dla bazy.

Przesuwany jest punkt, który analyze.py pewnie dopasował do szczytu albo wcięcia grani (bez uwagi w points.json),
o co najmniej MIN_MOVE m. Punktów ewidentnie złych, czyli takich, przy których w modelu nie ma pasującej formy
(np. wysokość z bazy daleka od każdego pobliskiego szczytu), nie zgadujemy: zostają w miejscu i są na liście
do przejrzenia.

Kolejność: analyze.py, correct_points.py, analyze.py (już na poprawionych punktach), export_sql.py. Kolejne
uruchomienia dopisują tylko punkty jeszcze niepoprawione. SQL zmienia punkt tylko wtedy,
gdy w bazie ma on jeszcze pierwotne współrzędne. Kolejność na bazie: migracja ridge_geometry, ten plik,
ridge-geometry.sql (wyzwalacz z migracji czyści linie grani przesuniętych punktów)."""

import json

from config import CORRECTIONS, DATA, POINTS, load_tatra_data

MIN_MOVE = 5  # m; mniejsze różnice to dokładność modelu i rysowania punktu
OUTPUT = DATA / "point-corrections.sql"


def main():
    data = load_tatra_data()
    points = {p["id"]: p for p in data["points"]}
    corrections = json.loads(CORRECTIONS.read_text(encoding="utf-8")) if CORRECTIONS.exists() else {}

    added = 0
    for p in json.loads(POINTS.read_text(encoding="utf-8")):
        # Raz poprawiony punkt zostaje: ponowne dopasowanie już przesuniętego punktu potrafi przeskoczyć dalej
        if str(p["id"]) in corrections:
            continue
        if p.get("lidar") and not p["note"] and p["shift"] >= MIN_MOVE:
            corrections[str(p["id"])] = p["lidar"]
            added += 1
    CORRECTIONS.write_text(json.dumps(corrections, indent=0), encoding="utf-8")

    sql = [
        "-- Wygenerowane przez tools/elevation/correct_points.py: położenie punktów według modelu terenu",
        "-- (NMT GUGiK, DMR 5.0 ÚGKK SR). Punkt zmienia się tylko, jeśli ma jeszcze pierwotne współrzędne.",
        "begin;",
    ]
    for pid, (lat, lng) in sorted(corrections.items(), key=lambda c: points[int(c[0])]["name"]):
        p = points[int(pid)]
        sql.append(f"-- {p['name']}: {p['originalLat']}, {p['originalLng']} -> {lat}, {lng}")
        sql.append(
            f'update public."MountainPoints" set "Latitude" = {lat}, "Longitude" = {lng} '
            f'where "Id" = {pid} and "Latitude" = {p["originalLat"]} and "Longitude" = {p["originalLng"]};'
        )
    sql.append("commit;")
    OUTPUT.write_text("\n".join(sql) + "\n", encoding="utf-8")
    print(f"nowe poprawki: {added}, razem {len(corrections)} punktów; {OUTPUT.name}")


if __name__ == "__main__":
    main()
