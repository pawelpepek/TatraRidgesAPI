-- Tests of migration 20261031120000_admin_writes_fixes. Run with `npm run db:test`.
-- Everything happens in one transaction that is rolled back; ids from 900001.
begin;
create extension if not exists pgtap with schema extensions;
select plan(5);

insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111', 'admin@test.local');
insert into public.admins (user_id) values ('11111111-1111-1111-1111-111111111111');

-- 900001 — 900002    900003 — 900004
insert into public."MountainPoints"
	("Id", "PointTypeId", "Name", "AlternativeName", "WikiAddress", "PrecisedEvaluation",
	 "WikiLatitude", "WikiLongitude", "Latitude", "Longitude")
select id, 1, 'Test ' || id, '', '', false, 49.2, 20.0, 49.2, 20.0
from generate_series(900001, 900004) id;
insert into public."PointsConnections" ("Id", "PointId1", "PointId2", "Ridge") values
	(900001, 900001, 900002, true),
	(900002, 900003, 900004, true);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}', true);

select lives_ok($$ select public.add_route(json_build_object(
		'pointId1', 900001, 'pointId2', 900002, 'difficultyValue', 3, 'difficultySign', '-',
		'rappeling', false, 'routeType', 2, 'routeTime', '01:30:45',
		'guideDescription', json_build_object('guideId', 1, 'page', 15, 'volume', 1, 'number', 'TEST-S'))) $$,
	'the admin adds a route whose time has seconds');

reset role;

select is((select r."RouteTime" from public."Routes" r
		join public."GuideDescriptions" g on g."Id" = r."GuideDescriptionId" where g."Number" = 'TEST-S'),
	interval '01:30', 'the route time is stored in whole minutes');

-- A route on the other ridge that shares the guide description (the schema allows it).
insert into public."Routes" ("Id", "PointsConnectionId", "ConsistentDirection", "DifficultyId",
	"DifficultyDetailId", "Rappeling", "RouteTypeId", "GuideDescriptionId", "RouteTime")
select 900001, 900002, true, r."DifficultyId", r."DifficultyDetailId", false, r."RouteTypeId",
	r."GuideDescriptionId", interval '1 hour'
from public."Routes" r
join public."GuideDescriptions" g on g."Id" = r."GuideDescriptionId" where g."Number" = 'TEST-S';

set local role authenticated;
select lives_ok($$ select public.delete_point(900001) $$, 'the admin deletes a point');
reset role;

select is((select count(*) from public."Routes" where "Id" = 900001), 1::bigint,
	'a route of another ridge sharing the guide description survives');
select is((select count(*) from public."PointsConnections" where "Id" = 900001), 0::bigint,
	'the ridges of the deleted point are gone');

select * from finish();
rollback;
