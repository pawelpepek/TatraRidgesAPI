-- Tests of migration 20261102120000_fold_guide_descriptions. Run with `npm run db:test`.
-- Everything happens in one transaction that is rolled back; ids from 900001.
begin;
create extension if not exists pgtap with schema extensions;
select plan(11);

select hasnt_table('public', 'GuideDescriptions', 'the guide descriptions table is gone');
select hasnt_column('public', 'Routes', 'GuideDescriptionId', 'routes no longer refer to it');
select col_not_null('public', 'Routes', 'GuideId', 'a route has a guide');
select col_not_null('public', 'Routes', 'GuideNumber', 'a route has a number in the guide');
select col_not_null('public', 'Routes', 'GuidePage', 'a route has a page in the guide');
select col_not_null('public', 'Routes', 'GuideVolume', 'a route has a volume of the guide');
select fk_ok('public', 'Routes', 'GuideId', 'public', 'Guides', 'Id');

insert into public."MountainPoints"
	("Id", "PointTypeId", "Name", "AlternativeName", "WikiAddress", "PrecisedEvaluation",
	 "WikiLatitude", "WikiLongitude", "Latitude", "Longitude")
select id, 1, 'Test ' || id, '', '', false, 49.2, 20.0, 49.2, 20.0
from generate_series(900001, 900002) id;
insert into public."PointsConnections" ("Id", "PointId1", "PointId2", "Ridge") values
	(900001, 900001, 900002, true);
insert into public."Guides" ("Id", "ShortName", "Name", "Author") values
	(32001, 'T', 'Test', 'Test');
insert into public."Routes" ("Id", "PointsConnectionId", "ConsistentDirection", "DifficultyId",
	"DifficultyDetailId", "Rappeling", "RouteTypeId", "RouteTime",
	"GuideId", "GuideNumber", "GuidePage", "GuideVolume")
select 900001, 900001, true, (select min("Id") from public."Difficulties"),
	(select min("Id") from public."DifficultyDetails"), false, (select min("Id") from public."RouteTypes"),
	interval '1 hour', 32001, 'TEST-G', 15, 2;

select is(
	(select r from json_array_elements(public.get_tatra_data() -> 'ridges') ridge,
		json_array_elements(ridge -> 'routes') r
	where (r ->> 'id')::bigint = 900001)::jsonb
		- array['consistentDirection', 'difficultyId', 'difficultyDetailId', 'rappeling', 'routeTypeId',
			'adjectiveIds', 'additional'],
	'{"id": 900001, "routeTimeMin": 60, "guideId": 32001, "guideNumber": "TEST-G", "guidePage": 15, "guideVolume": 2}'::jsonb,
	'get_tatra_data() returns the guide reference of a route');

select throws_ok($$ delete from public."Guides" where "Id" = 32001 $$, '23503', null,
	'a guide used by a route cannot be deleted');

delete from public."PointsConnections" where "Id" = 900001;
select is((select count(*) from public."Routes" where "Id" = 900001), 0::bigint,
	'deleting a ridge still removes its routes');
select lives_ok($$ delete from public."Guides" where "Id" = 32001 $$, 'an unused guide can be deleted');

select * from finish();
rollback;
