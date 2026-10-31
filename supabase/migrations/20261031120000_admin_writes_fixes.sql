-- Fixes of the admin writes from 20261025170000_admin_writes:
-- - adding ridges is serialised, so two concurrent calls cannot both pass the loop check
--   and create a duplicate ridge or a loop;
-- - delete_point keeps guide descriptions that are still used by routes of other ridges
--   (deleting a description cascades to its routes);
-- - add_route stores the route time in whole minutes, as get_tatra_data() reads it.
-- Only functions change; grants survive `create or replace`.

-- Writers of ridges take this lock before looking for a ridge; reads are not blocked.
create or replace function private.insert_connection(point_id1 integer, point_id2 integer)
returns bigint
language plpgsql
set search_path = ''
as $$
declare
	new_id bigint;
begin
	lock table public."PointsConnections" in share row exclusive mode;

	perform private.require_point(point_id1);
	perform private.require_point(point_id2);

	if point_id1 = point_id2 then
		raise exception 'Nie można połączyć punktu z samym sobą' using errcode = '23514';
	end if;
	if private.ridge_connects(point_id1, point_id2) then
		raise exception 'Nie mozna zapisać takiego połączenia ponieważ powoduje zapętlenie grani!'
			using errcode = '23514';
	end if;

	insert into public."PointsConnections" ("PointId1", "PointId2", "Ridge")
	values (point_id1, point_id2, true)
	returning "Id" into new_id;

	return new_id;
end;
$$;

create or replace function public.delete_point(point_id integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
	perform private.assert_admin();
	perform private.require_point(point_id);

	-- Cascades to the routes, their adjective pairs and additional descriptions.
	delete from public."GuideDescriptions" g
	using public."Routes" r, public."PointsConnections" c
	where r."GuideDescriptionId" = g."Id"
		and c."Id" = r."PointsConnectionId"
		and point_id in (c."PointId1", c."PointId2")
		and not exists (
			select 1
			from public."Routes" other
			join public."PointsConnections" oc on oc."Id" = other."PointsConnectionId"
			where other."GuideDescriptionId" = g."Id"
				and point_id not in (oc."PointId1", oc."PointId2")
		);

	delete from public."PointsConnections" where point_id in ("PointId1", "PointId2");
	delete from public."MountainPoints" where "Id" = point_id;
end;
$$;

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
	guide_description_id integer;
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

	insert into public."GuideDescriptions" ("GuideId", "Number", "Page", "Volume")
	values (
		(route -> 'guideDescription' ->> 'guideId')::smallint,
		route -> 'guideDescription' ->> 'number',
		(route -> 'guideDescription' ->> 'page')::smallint,
		(route -> 'guideDescription' ->> 'volume')::smallint
	)
	returning "Id" into guide_description_id;

	insert into public."Routes" (
		"PointsConnectionId", "ConsistentDirection", "DifficultyId", "DifficultyDetailId",
		"Rappeling", "RouteTypeId", "GuideDescriptionId", "RouteTime"
	)
	values (
		connection."Id",
		connection."PointId1" = point_id1,
		(route ->> 'difficultyValue')::smallint,
		detail_id,
		(route ->> 'rappeling')::boolean,
		(route ->> 'routeType')::smallint,
		guide_description_id,
		date_trunc('minute', (route ->> 'routeTime')::interval)
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
