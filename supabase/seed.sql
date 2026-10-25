-- Local development data, loaded by `supabase start` and `supabase db reset`.
-- The same data the C# DbSeeder put into an empty database: dictionaries and a small
-- example around Świnica. Not used in production.

insert into "Difficulties" ("Id", "Text") values
    (0, '0'), (1, 'I'), (2, 'II'), (3, 'III'), (4, 'IV'), (5, 'V'), (6, 'VI'), (7, 'VII');

insert into "DifficultyDetails" ("Id", "Sign") values
    (0, ''), (1, '+'), (2, '-');

insert into "PointTypes" ("Id", "Name") values
    (1, 'Szczyt'), (2, 'Przełęcz'), (3, 'Start');

insert into "Adjectives" ("Id", "Text", "Rank") values
    ('_c', 'Ciekawa', 3),
    ('_e', 'Eksponowana', 5),
    ('_k', 'Krucha', -5),
    ('_p', 'Piękna', 5),
    ('_w', 'Widokowo piękna', 5),
    ('bk', 'Bardzo krucha', -7),
    ('bp', 'Bardzo piękna', 7),
    ('bw', 'Widokowo bardzo piękna', 7),
    ('be', 'Bardzo eksponowana', 7),
    ('ce', 'Cześciowo eksponowana', 3),
    ('ck', 'Częściowo krucha', -3),
    ('me', 'Nieco eksponowana', 3),
    ('nc', 'Nieciekawa', -7),
    ('wk', 'Niezwykle krucha', -10),
    ('wp', 'Wspaniała', 10),
    ('ww', 'Widokowo wspaniała', 10),
    ('_z', 'Zajmująca', 2),
    ('dz', 'Dość zajmująca', 1),
    ('dc', 'Dość ciekawa', 1);

insert into "Guides" ("Id", "ShortName", "Name", "Author") values
    (1, 'WHP', 'Tatry Wysokie Przewodnik Taternicki', 'Witold Henryk Paryski'),
    (2, 'WC', 'Tatry Przewodnik Szczegółowy', 'Władysław Cywiński');

insert into "RouteTypes" ("Id", "Name", "Rank") values
    (1, 'Ściśle granią', 2),
    (2, 'Prawie ściśle granią', 1),
    (3, 'Obchodząc grań', 3);

insert into "Roles" ("Id", "Name") values
    (1, 'User'), (2, 'Admin');

insert into "MountainPoints"
    ("Id", "PointTypeId", "Name", "AlternativeName", "WikiAddress", "Evaluation", "PrecisedEvaluation",
     "WikiLatitude", "WikiLongitude", "Latitude", "Longitude")
values
    (1, 1, 'Świnica', 'Svinica', 'Świnica', 2301, true, 49.219417, 20.009306, 49.219417, 20.009306),
    (2, 1, 'Świnica Taternicka', 'Svinica Severozápadna', 'Świnica', 2991, true, 49.220080, 20.008627, 49.220080, 20.008627),
    (3, 2, 'Gąsienicowa Przełączka', 'Gąsienicova štrbina', 'Gąsienicowa_Przełączka', 2265, false, 49.219333, 20.010694, 49.219333, 20.010694),
    (4, 2, 'Walentkowa Przełęcz', 'Valentkovo sedlo', 'Walentkowa_Przełęcz', 2100, true, 49.216361, 20.009139, 49.216361, 20.009139),
    (5, 1, 'Walentkowy Wierch', 'Valentkova', 'Walentkowy_Wierch', 2156, true, 49.213889, 20.006944, 49.213889, 20.006944),
    (6, 1, 'Gąsienicowa Turnia', 'Gąsienicova turnia', 'Gąsienicowa_Turnia', 2280, true, 49.219444, 20.011944, 49.219444, 20.011944);

insert into "PointsConnections" ("Id", "PointId1", "PointId2", "Ridge") values
    (1, 2, 1, true),
    (2, 1, 3, true),
    (3, 1, 4, true),
    (4, 4, 5, true),
    (5, 3, 6, true);

insert into "GuideDescriptions" ("Id", "GuideId", "Number", "Page", "Volume") values
    (1, 1, '31 C,E', 57, 1),
    (2, 1, '41 R', 73, 1),
    (3, 1, '44 B-E', 77, 1),
    (4, 1, '44 A', 77, 1),
    (5, 1, '41 O,P', 73, 1);

insert into "Routes"
    ("Id", "PointsConnectionId", "ConsistentDirection", "DifficultyId", "DifficultyDetailId",
     "Rappeling", "RouteTypeId", "GuideDescriptionId", "RouteTime")
values
    (1, 1, true, 1, 0, false, 2, 1, '00:10:00'),
    (2, 2, true, 0, 1, false, 2, 2, '00:10:00'),
    (3, 3, false, 2, 0, false, 2, 3, '01:15:00'),
    (4, 4, false, 2, 0, false, 2, 4, '01:15:00'),
    (5, 5, false, 1, 0, false, 2, 5, '00:08:00');

insert into "DescriptionAdjectivePairs" ("RouteId", "AdjectiveId") values
    (1, '_e'), (1, 'dz'),
    (3, '_e'), (3, 'dc'),
    (4, '_e'), (4, 'dc');

-- Explicit ids above do not move the identity sequences.
select setval(pg_get_serial_sequence('"Roles"', 'Id'), (select max("Id") from "Roles"));
select setval(pg_get_serial_sequence('"MountainPoints"', 'Id'), (select max("Id") from "MountainPoints"));
select setval(pg_get_serial_sequence('"PointsConnections"', 'Id'), (select max("Id") from "PointsConnections"));
select setval(pg_get_serial_sequence('"GuideDescriptions"', 'Id'), (select max("Id") from "GuideDescriptions"));
select setval(pg_get_serial_sequence('"Routes"', 'Id'), (select max("Id") from "Routes"));

-- Local admin for signing in to the app (local Supabase only, not a real account):
--   e-mail: admin@graniowki.local
--   hasło:  graniowki-lokalnie
insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change)
values (
    '00000000-0000-0000-0000-000000000000', 'aaaaaaaa-0000-4000-8000-000000000001',
    'authenticated', 'authenticated', 'admin@graniowki.local',
    extensions.crypt('graniowki-lokalnie', extensions.gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', '');

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values (
    gen_random_uuid(), 'aaaaaaaa-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001',
    '{"sub": "aaaaaaaa-0000-4000-8000-000000000001", "email": "admin@graniowki.local"}', 'email', now(), now(), now());

insert into public.admins (user_id) values ('aaaaaaaa-0000-4000-8000-000000000001');
