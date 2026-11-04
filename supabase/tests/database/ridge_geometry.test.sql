-- Tests of migration 20261104120000_ridge_geometry. Run with `npm run db:test`.
-- Everything happens in one transaction that is rolled back; ids from 900001.
begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

select has_column('public', 'PointsConnections', 'Line', 'a ridge can have a line');
select has_column('public', 'PointsConnections', 'Profile', 'a ridge can have a profile');
select ok(has_function_privilege('anon', 'public.get_ridge_geometry()', 'execute'), 'anyone can read the geometry');

insert into public."MountainPoints"
	("Id", "PointTypeId", "Name", "AlternativeName", "WikiAddress", "PrecisedEvaluation",
	 "WikiLatitude", "WikiLongitude", "Latitude", "Longitude")
select id, 1, 'Test ' || id, '', '', false, 49.2, 20.0, 49.2, 20.0 + (id - 900001) * 0.001
from generate_series(900001, 900003) id;
insert into public."PointsConnections" ("Id", "PointId1", "PointId2", "Ridge", "Line", "Profile") values
	(900001, 900001, 900002, true, '[[49.2, 20.0], [49.2005, 20.0005], [49.2, 20.001]]', '{2000,2003,2001}'),
	(900002, 900002, 900003, true, '[[49.2, 20.001], [49.2, 20.002]]', '{2001,1990}'),
	(900003, 900001, 900003, true, null, null);

select is(
	(select g::jsonb from json_array_elements(public.get_ridge_geometry()) g where (g ->> 'id')::int = 900001),
	'{"id": 900001, "line": [[49.2, 20.0], [49.2005, 20.0005], [49.2, 20.001]], "profile": [2000, 2003, 2001]}'::jsonb,
	'get_ridge_geometry() returns the line and the profile');
select is(
	(select count(*)::int from json_array_elements(public.get_ridge_geometry()) g where (g ->> 'id')::int = 900003),
	0, 'ridges without data are left out');

update public."MountainPoints" set "Name" = 'Renamed' where "Id" = 900001;
select isnt((select "Line" from public."PointsConnections" where "Id" = 900001), null,
	'renaming a point keeps its ridges'' lines');

update public."MountainPoints" set "Latitude" = 49.2001 where "Id" = 900001;
select is((select "Line" from public."PointsConnections" where "Id" = 900001), null,
	'moving a point drops the line of its ridge');
select isnt((select "Profile" from public."PointsConnections" where "Id" = 900002), null,
	'ridges of other points keep theirs');

select * from finish();
rollback;
