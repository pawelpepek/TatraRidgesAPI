-- Folds "GuideDescriptions" into "Routes". Every route had exactly one guide description
-- (a 1:1 relation EF kept as a separate table), so its four fields become columns of the
-- route. Descriptions no route used are dropped with the table.
--
-- Needs the old ASP.NET API to be off: its EF model reads "GuideDescriptions".
-- Apply after 20261031120000_admin_writes_fixes; get_tatra_data(), delete_point and
-- add_route are replaced here, grants survive `create or replace`.

alter table public."Routes"
	add column "GuideId" smallint,
	add column "GuideNumber" character varying(20),
	add column "GuidePage" smallint,
	add column "GuideVolume" smallint;

update public."Routes" r
set "GuideId" = g."GuideId",
	"GuideNumber" = g."Number",
	"GuidePage" = g."Page",
	"GuideVolume" = g."Volume"
from public."GuideDescriptions" g
where g."Id" = r."GuideDescriptionId";

-- Deleting a guide no longer cascades to its routes (it did through "GuideDescriptions").
alter table public."Routes"
	alter column "GuideId" set not null,
	alter column "GuideNumber" set not null,
	alter column "GuidePage" set not null,
	alter column "GuideVolume" set not null,
	add constraint "FK_Routes_Guides_GuideId" foreign key ("GuideId")
		references public."Guides" ("Id") on delete restrict;
create index "IX_Routes_GuideId" on public."Routes" ("GuideId");

-- Takes its foreign key and index with it.
alter table public."Routes" drop column "GuideDescriptionId";
drop table public."GuideDescriptions";

create or replace function public.get_tatra_data()
returns json
language sql
stable
security definer
set search_path = ''
as $$
	select json_build_object(
		'points', coalesce((
			select json_agg(json_build_object(
				'id', p."Id",
				'name', p."Name",
				'altName', p."AlternativeName",
				'evaluation', p."Evaluation",
				'precisedEvaluation', p."PrecisedEvaluation",
				'lat', p."Latitude",
				'lng', p."Longitude",
				'wikiLat', p."WikiLatitude",
				'wikiLng', p."WikiLongitude",
				'wikiAddress', p."WikiAddress",
				'pointTypeId', p."PointTypeId"
			) order by p."Id")
			from public."MountainPoints" p
		), '[]'::json),

		'ridges', coalesce((
			select json_agg(json_build_object(
				'id', c."Id",
				'pointId1', c."PointId1",
				'pointId2', c."PointId2",
				'routes', coalesce((
					select json_agg(json_build_object(
						'id', r."Id",
						'consistentDirection', r."ConsistentDirection",
						'difficultyId', r."DifficultyId",
						'difficultyDetailId', r."DifficultyDetailId",
						'rappeling', r."Rappeling",
						'routeTypeId', r."RouteTypeId",
						'routeTimeMin', (extract(epoch from r."RouteTime") / 60)::integer,
						'guideId', r."GuideId",
						'guideNumber', r."GuideNumber",
						'guidePage', r."GuidePage",
						'guideVolume', r."GuideVolume",
						'adjectiveIds', coalesce((
							select json_agg(dp."AdjectiveId" order by dp."Id")
							from public."DescriptionAdjectivePairs" dp
							where dp."RouteId" = r."Id"
						), '[]'::json),
						'additional', coalesce((
							select json_agg(json_build_object(
								'description', a."Description",
								'warning', a."Warning"
							) order by a."Id")
							from public."AdditionalDescriptions" a
							where a."RouteId" = r."Id"
						), '[]'::json)
					) order by r."Id")
					from public."Routes" r
					where r."PointsConnectionId" = c."Id"
				), '[]'::json)
			) order by c."Id")
			from public."PointsConnections" c
			where c."Ridge"
		), '[]'::json),

		'params', json_build_object(
			-- Physical order, as EF read them without ORDER BY: the order of adjective groups
			-- decides the word order in route descriptions.
			'adjectives', coalesce((
				select json_agg(json_build_object('id', a."Id", 'text', a."Text", 'rank', a."Rank") order by a.ctid)
				from public."Adjectives" a
			), '[]'::json),
			'difficulties', coalesce((
				select json_agg(json_build_object('id', d."Id", 'text', d."Text") order by d."Id")
				from public."Difficulties" d
			), '[]'::json),
			'difficultyDetails', coalesce((
				select json_agg(json_build_object('id', d."Id", 'sign', d."Sign") order by d."Id")
				from public."DifficultyDetails" d
			), '[]'::json),
			'guides', coalesce((
				select json_agg(json_build_object(
					'id', g."Id", 'shortName', g."ShortName", 'name', g."Name", 'author', g."Author"
				) order by g."Id")
				from public."Guides" g
			), '[]'::json),
			'routeTypes', coalesce((
				select json_agg(json_build_object('id', t."Id", 'name', t."Name", 'rank', t."Rank") order by t."Id")
				from public."RouteTypes" t
			), '[]'::json),
			'pointTypes', coalesce((
				select json_agg(json_build_object('id', t."Id", 'name', t."Name") order by t."Id")
				from public."PointTypes" t
			), '[]'::json)
		)
	);
$$;

-- DELETE point/{id}: the point and its ridges; the ridges cascade to their routes,
-- adjective pairs and additional descriptions.
create or replace function public.delete_point(point_id integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
	perform private.assert_admin();
	perform private.require_point(point_id);

	delete from public."PointsConnections" where point_id in ("PointId1", "PointId2");
	delete from public."MountainPoints" where "Id" = point_id;
end;
$$;

-- POST route: the input keeps its nested guideDescription, as the frontend sends it.
create or replace function public.add_route(route json)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
	point_id1 integer := (route ->> 'pointId1')::integer;
	point_id2 integer := (route ->> 'pointId2')::integer;
	detail_id smallint;
	connection public."PointsConnections";
	new_connection_id bigint;
	is_new_connection boolean := false;
	new_route_id bigint;
begin
	perform private.assert_admin();

	select "Id" into detail_id
	from public."DifficultyDetails"
	where "Sign" = route ->> 'difficultySign';
	if detail_id is null then
		raise exception 'Nieznany znak trudności "%"', route ->> 'difficultySign' using errcode = 'P0002';
	end if;

	-- Held until the end of the transaction, so no other call adds the same ridge meanwhile.
	lock table public."PointsConnections" in share row exclusive mode;

	select * into connection
	from public."PointsConnections" c
	where c."Ridge"
		and point_id1 in (c."PointId1", c."PointId2")
		and point_id2 in (c."PointId1", c."PointId2")
	order by c."Id"
	limit 1;

	if not found then
		-- Called once on its own: inside a WHERE clause it would run for every row scanned.
		new_connection_id := private.insert_connection(point_id1, point_id2);
		select * into connection from public."PointsConnections" where "Id" = new_connection_id;
		is_new_connection := true;
	end if;

	insert into public."Routes" (
		"PointsConnectionId", "ConsistentDirection", "DifficultyId", "DifficultyDetailId",
		"Rappeling", "RouteTypeId", "RouteTime",
		"GuideId", "GuideNumber", "GuidePage", "GuideVolume"
	)
	values (
		connection."Id",
		connection."PointId1" = point_id1,
		(route ->> 'difficultyValue')::smallint,
		detail_id,
		(route ->> 'rappeling')::boolean,
		(route ->> 'routeType')::smallint,
		date_trunc('minute', (route ->> 'routeTime')::interval),
		(route -> 'guideDescription' ->> 'guideId')::smallint,
		route -> 'guideDescription' ->> 'number',
		(route -> 'guideDescription' ->> 'page')::smallint,
		(route -> 'guideDescription' ->> 'volume')::smallint
	)
	returning "Id" into new_route_id;

	-- One adjective per group (second letter of the id), the one with the highest rank,
	-- inserted in group order.
	insert into public."DescriptionAdjectivePairs" ("RouteId", "AdjectiveId")
	select new_route_id, chosen."Id"
	from (
		select distinct on (substr(a."Id", 2)) a."Id", substr(a."Id", 2) as adjective_group
		from public."Adjectives" a
		where a."Id" in (select json_array_elements_text(coalesce(route -> 'adjectives', '[]'::json)))
		order by substr(a."Id", 2), a."Rank" desc, a.ctid
	) chosen
	order by chosen.adjective_group;

	insert into public."AdditionalDescriptions" ("RouteId", "Description", "Warning")
	select new_route_id, d ->> 'description', coalesce((d ->> 'warning')::boolean, false)
	from json_array_elements(coalesce(route -> 'additionalDescriptions', '[]'::json))
		with ordinality as x (d, n)
	order by n;

	return json_build_object(
		'routeId', new_route_id,
		'pointsRidge', case when is_new_connection then (
			select json_build_object(
				'id', connection."Id",
				'pointId1', connection."PointId1",
				'pointId2', connection."PointId2",
				'pointFrom', json_build_object('latitude', p_from."Latitude", 'longitude', p_from."Longitude"),
				'pointTo', json_build_object('latitude', p_to."Latitude", 'longitude', p_to."Longitude")
			)
			from public."MountainPoints" p_from, public."MountainPoints" p_to
			where p_from."Id" = connection."PointId1" and p_to."Id" = connection."PointId2"
		) end
	);
end;
$$;
