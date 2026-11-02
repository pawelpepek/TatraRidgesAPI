-- One-off data fix for production (2026-10): fills "Evaluation" of the points that have
-- none, all on the Slovak side (Łomnica, Kieżmarski, Jagnięcy, Jastrzębia and Kołowa
-- Turnia). The heights come from the Slovak LiDAR terrain model DMR 5.0 (ÚGKK SR / ZBGIS,
-- 1 m, scanned 2018, CC BY 4.0), read around the stored coordinates, which are often only
-- accurate to ~30 m: a peak gets the highest cell within ±24 m, a pass the highest col
-- between the sides of its two ridge neighbours. On points with a precise height the same
-- method has a median error of 2 m. Every value is marked "PrecisedEvaluation" = false.
--
-- "-- " notes mark values that clash with a neighbour on the ridge; the neighbour's height
-- is usually a rounded approximation itself.
--
-- Three passes with a single ridge neighbour have no col to measure. Their heights at the
-- end of the list are rough readings of a denser LiDAR grid, guided by the Polish
-- Wikipedia descriptions:
--   1583 Spiski Karbik: a notch just west of the dome of Skrajna Spiska Turniczka (2376),
--     a few metres below it; ±10 m.
--   1395 Niżni Łomnicki Przechód: the stored point was ~200 m west of the ridge, on the
--     slope above a gully (1878 m there). The Wikipedia coordinates lie on the SW ridge of
--     Łomnicka Kopa at ~2045 m, so the point is moved there too; ±15 m.
--   1507 Przełączka za Czarną Basztą: neither the tower nor the notch shows on an 8 m
--     grid; the value is the height of Czarny Grzbiet beside the stored point; ±20 m.
--
-- Only rows whose "Evaluation" is still null and whose name matches are changed, and the
-- point is moved only from its old coordinates, so the script is safe to run again.

begin;

update public."MountainPoints"
set "Latitude" = 49.188972, "Longitude" = 20.211333
where "Id" = 1395 and "Name" = 'Niżni Łomnicki Przechód'
	and "Latitude" = 49.188996 and "Longitude" = 20.208492;

with estimates ("Id", "Name", "Evaluation") as (
	values
		(1765, 'Biała Kopa',                      1925),
		(1770, 'Biały Kopiniak',                  2037), -- below the pass Biały Karbik 2100
		(1778, 'Czarna Baszta',                   2309),
		(1779, 'Czarna Turniczka',                2348),
		(1781, 'Czarny Kopiniak',                 2321), -- below the pass Czarny Karb 2328
		(1787, 'Durna Kopa',                      2413),
		(1788, 'Durna Turniczka',                 2553),
		(1812, 'Jastrzębi Kopiniaczek',           2165), -- below the pass Jastrzębie Wrótka 2200
		(1813, 'Jastrzębia Czubka',               2220), -- below the pass Jastrzębi Karbik 2225
		(1831, 'Kołowa Kazalnica',                1973),
		(1833, 'Kołowy Chłopek',                  2306),
		(1850, 'Mała Jagnięca Baszta',            2054),
		(1857, 'Mała Poślednia Turniczka',        2525),
		(1863, 'Mała Złota Kazalnica',            1824),
		(1864, 'Mały Jagnięcy Kopiniak',          2175),
		(1865, 'Mały Jastrzębi Ząb',              1821), -- below the pass Niżnia Jastrzębia Szczerbina 1870
		(1873, 'Myśliwska Czuba',                 2135),
		(1453, 'Pośredni Jagnięcy Przechód',      2051),
		(1895, 'Pośredni Jastrzębi Ząb',          1931),
		(1455, 'Pośredni Łomnicki Karb',          2488), -- above the peak Łomnicka Kopa 2421
		(1456, 'Pośredni Łomnicki Przechód',      2105),
		(1464, 'Pośrednia Jastrzębia Szczerbina', 1895),
		(1903, 'Pośrednia Kołowa Turnia',         2079),
		(1467, 'Pośrednia Kołowa Ławka',          2073),
		(1479, 'Pośrednia Spiska Przełączka',     2384),
		(1912, 'Pośrednia Złota Kazalnica',       2023),
		(1490, 'Przełączka pod Czubatą Turnią',   2536),
		(1494, 'Przełączka pod Łomnicą',          2485),
		(1929, 'Skrajna Jagnięca Kopka',          2092), -- below the pass Skrajna Jagnięca Szczerbina 2100
		(1556, 'Skrajna Kozia Szczerbina',        2072),
		(1555, 'Skrajna Kołowa Ławka',            1968),
		(1562, 'Skrajna Rzeżuchowa Przełączka',   2020),
		(2040, 'Skrajna Rzeżuchowa Turnia',       2022),
		(1565, 'Skrajna Świnkowa Szczerbina',     2144),
		(1939, 'Skrajna Żółta Kopka',             2080),
		(1567, 'Skrajna Żółta Szczerbina',        2072),
		(1569, 'Skrajny Jastrzębi Karb',          2246),
		(1950, 'Spiska Czubka',                   2377),
		(1581, 'Spiska Przełączka',               2364),
		(1582, 'Spiska Szczerbina',               2452),
		(1544, 'Sępia Przełączka',                2513),
		(1976, 'Wielka Jagnięca Baszta',          2138),
		(1990, 'Wielka Złota Kazalnica',          2053),
		(1992, 'Wielki Jastrzębi Ząb',            1972),
		(1646, 'Wyżni Jagnięcy Karb',             2208),
		(1647, 'Wyżni Jagnięcy Przechód',         2135),
		(1648, 'Wyżni Kieżmarski Przechód',       2410),
		(1649, 'Wyżni Kołowy Przechód',           2098),
		(1652, 'Wyżni Myśliwski Przechód',        2132),
		(1651, 'Wyżni Łomnicki Przechód',         2215),
		(1660, 'Wyżnia Biała Przełączka',         1935),
		(1666, 'Wyżnia Jastrzębia Szczerbina',    1965),
		(1674, 'Wyżnia Miedziana Przełączka',     2554),
		(1677, 'Wyżnia Poślednia Przełączka',     2520),
		(1680, 'Wyżnia Przełęcz w Widłach',       2487),
		(1687, 'Wyżnia Spiska Przełączka',        2421),
		(1703, 'Zadni Jastrzębi Karb',            2248),
		(1711, 'Zadnia Kozia Szczerbina',         2068),
		(1710, 'Zadnia Kołowa Ławka',             2145),
		(2010, 'Zadnia Rzeżuchowa Turnia',        2068), -- below the pass Zadnia Rzeżuchowa Przełączka 2068
		(2012, 'Zadnia Spiska Turniczka',         2448),
		(1718, 'Zadnia Żółta Szczerbina',         2081), -- above the peak Zadnia Żółta Kopka 2080
		(2016, 'Zadnie Jagnięce Kopki',           2097), -- below the pass Skrajna Jagnięca Szczerbina 2100
		(1725, 'Zębata Szczerbina',               2519),
		(2021, 'Zębata Turnia',                   2540),
		-- rough readings, see above
		(1583, 'Spiski Karbik',                   2370),
		(1395, 'Niżni Łomnicki Przechód',         2040),
		(1507, 'Przełączka za Czarną Basztą',     2320)
),
updated as (
	update public."MountainPoints" p
	set "Evaluation" = e."Evaluation", "PrecisedEvaluation" = false
	from estimates e
	where p."Id" = e."Id" and p."Name" = e."Name" and p."Evaluation" is null
	returning p."Id"
)
select (select count(*) from updated) as updated, (select count(*) from estimates) as estimates;

commit;
