-- Tests of the admin write functions (migration 20261025170000_admin_writes).
-- Run with `npm run db:test`. Everything happens in one transaction that is rolled back;
-- the test data uses ids from 900001 so it never meets real rows.
begin;
create extension if not exists pgtap with schema extensions;
select plan(33);

-- Fixtures ------------------------------------------------------------------------------

insert into auth.users (id, email) values
	('11111111-1111-1111-1111-111111111111', 'admin@test.local'),
	('22222222-2222-2222-2222-222222222222', 'user@test.local');
insert into public.admins (user_id) values ('11111111-1111-1111-1111-111111111111');

-- 900001 — 900002 — 900003    900004    900005
insert into public."MountainPoints"
	("Id", "PointTypeId", "Name", "AlternativeName", "WikiAddress", "PrecisedEvaluation",
	 "WikiLatitude", "WikiLongitude", "Latitude", "Longitude")
select id, 1, 'Test ' || id, '', '', false, 49.2, 20.0, 49.2, 20.0
from generate_series(900001, 900005) id;
insert into public."PointsConnections" ("Id", "PointId1", "PointId2", "Ridge") values
	(900001, 900001, 900002, true),
	(900002, 900003, 900002, true);

create function public.test_route_json(point_id1 integer, point_id2 integer, number text, sign text default '-')
returns json language sql as $$
	select json_build_object(
		'pointId1', point_id1, 'pointId2', point_id2,
		'difficultyValue', 3, 'difficultySign', sign, 'rappeling', true, 'routeType', 2,
		'guideDescription', json_build_object('guideId', 1, 'page', 15, 'volume', 1, 'number', number),
		'routeTime', '01:30:00',
		'adjectives', json_build_array('ce', 'be', '_k', '_p'),
		'additionalDescriptions', json_build_array(json_build_object('description', 'Luźne bloki', 'warning', true)))
$$;
grant execute on function public.test_route_json(integer, integer, text, text) to anon, authenticated;

-- Who is calling ------------------------------------------------------------------------

set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true);

select is(public.is_admin(), false, 'anon is not an admin');
select throws_ok($$ select public.move_point(900001, 49.2, 20.0) $$, '42501',
	'permission denied for function move_point', 'anon cannot call move_point');
select throws_ok($$ select public.add_route(public.test_route_json(900001, 900002, 'X')) $$, '42501',
	'permission denied for function add_route', 'anon cannot call add_route');
select throws_ok($$ select * from public.admins $$, '42501',
	'permission denied for table admins', 'anon cannot read admins');
select lives_ok($$ select public.get_tatra_data() $$, 'anon can still read the data');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "22222222-2222-2222-2222-222222222222", "role": "authenticated"}', true);

select is(public.is_admin(), false, 'a signed-in user who is not an admin is not an admin');
select throws_ok($$ select public.move_point(900001, 49.2, 20.0) $$, '42501', 'Brak uprawnień',
	'a non-admin cannot move a point');
select throws_ok($$ select public.delete_point(900001) $$, '42501', 'Brak uprawnień',
	'a non-admin cannot delete a point');
select throws_ok($$ select public.add_connection(900003, 900004) $$, '42501', 'Brak uprawnień',
	'a non-admin cannot add a ridge');
select throws_ok($$ select public.add_route(public.test_route_json(900001, 900002, 'X')) $$, '42501', 'Brak uprawnień',
	'a non-admin cannot add a route');
select throws_ok($$ insert into public.admins (user_id) values ('22222222-2222-2222-2222-222222222222') $$, '42501',
	'permission denied for table admins', 'a non-admin cannot make themselves an admin');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}', true);

select is(public.is_admin(), true, 'the admin is an admin');

-- move_point ------------------------------------------------------------------------------

select lives_ok($$ select public.move_point(900001, 49.25, 20.1) $$, 'the admin moves a point');
select throws_ok($$ select public.move_point(900001, 50, 20.1) $$, '22003',
	'Szerokość geograficzna musi być z zakresu <49.12; 49.29>.', 'a latitude outside the Tatras is refused');
select throws_ok($$ select public.move_point(900001, 50, 21) $$, '22003',
	E'Szerokość geograficzna musi być z zakresu <49.12; 49.29>.\nDługość geograficzna musi być z zakresu <19.91; 20.29>.',
	'both coordinates are reported');
select throws_ok($$ select public.move_point(999999999, 49.2, 20) $$, 'P0002',
	'Nie ma punktu z Id = 999999999', 'moving a missing point fails');

-- add_connection --------------------------------------------------------------------------

select isnt(public.add_connection(900003, 900004), null::bigint, 'the admin adds a ridge');
select throws_ok($$ select public.add_connection(900001, 900004) $$, '23514',
	'Nie mozna zapisać takiego połączenia ponieważ powoduje zapętlenie grani!', 'a ridge closing a loop is refused');
select throws_ok($$ select public.add_connection(900005, 900005) $$, '23514',
	'Nie można połączyć punktu z samym sobą', 'a ridge from a point to itself is refused');
select throws_ok($$ select public.add_connection(900005, 999999999) $$, 'P0002',
	'Nie ma punktu z Id = 999999999', 'a ridge to a missing point is refused');

-- add_route -------------------------------------------------------------------------------

select is(public.add_route(public.test_route_json(900002, 900001, 'TEST-A')) ->> 'pointsRidge', null,
	'a route on an existing ridge does not report a new ridge');
select is(public.add_route(public.test_route_json(900004, 900005, 'TEST-B')) -> 'pointsRidge' ->> 'pointId1', '900004',
	'a route between unconnected points creates the ridge and reports it');
select throws_ok($$ select public.add_route(public.test_route_json(900001, 900005, 'TEST-C')) $$, '23514',
	'Nie mozna zapisać takiego połączenia ponieważ powoduje zapętlenie grani!', 'a route that would close a loop is refused');
select throws_ok($$ select public.add_route(public.test_route_json(900001, 900002, 'TEST-D', '?')) $$, 'P0002',
	'Nieznany znak trudności "?"', 'an unknown difficulty sign is refused');

-- delete_point ----------------------------------------------------------------------------

select lives_ok($$ select public.delete_point(900002) $$, 'the admin deletes a point');
select throws_ok($$ select public.delete_point(999999999) $$, 'P0002',
	'Nie ma punktu z Id = 999999999', 'deleting a missing point fails');

-- Results, checked as the table owner ----------------------------------------------------------

reset role;

select results_eq(
	$$ select "Latitude", "Longitude" from public."MountainPoints" where "Id" = 900001 $$,
	$$ values (49.25::numeric(8,6), 20.1::numeric(8,6)) $$,
	'the point has the new coordinates');

select results_eq(
	$$ select r."ConsistentDirection", r."DifficultyId", d."Sign", r."Rappeling", r."RouteTypeId", r."RouteTime",
			r."GuideId", r."GuidePage", r."GuideVolume"
		from public."Routes" r
		join public."DifficultyDetails" d on d."Id" = r."DifficultyDetailId"
		where r."GuideNumber" = 'TEST-B' $$,
	$$ values (true, 3::smallint, '-'::varchar, true, 2::smallint, interval '01:30', 1::smallint, 15::smallint, 1::smallint) $$,
	'the new route is stored with its guide reference');

select results_eq(
	$$ select p."AdjectiveId"::text from public."DescriptionAdjectivePairs" p
		join public."Routes" r on r."Id" = p."RouteId"
		where r."GuideNumber" = 'TEST-B' order by p."Id" $$,
	$$ values ('be'), ('_k'), ('_p') $$,
	'one adjective per group, the highest rank, in group order');

select results_eq(
	$$ select a."Description", a."Warning" from public."AdditionalDescriptions" a
		join public."Routes" r on r."Id" = a."RouteId"
		where r."GuideNumber" = 'TEST-B' $$,
	$$ values ('Luźne bloki'::text, true) $$,
	'additional descriptions are stored');

select is((select count(*) from public."Routes" where "GuideNumber" in ('TEST-A', 'TEST-C', 'TEST-D')), 0::bigint,
	'deleting the point removed its routes, failed routes left nothing');

select is((select count(*) from public."PointsConnections" where 900002 in ("PointId1", "PointId2")), 0::bigint,
	'deleting the point removed its ridges');

select is((select count(*) from public."MountainPoints" where "Id" = 900002), 0::bigint,
	'the point is deleted');

select * from finish();
rollback;
