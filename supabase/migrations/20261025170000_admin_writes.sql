-- Admin sign-in (Supabase Auth) and the writes of the former ASP.NET API, as SQL
-- functions. Each write runs in one transaction, checks that the caller is an admin
-- and repeats the validation of the C# model (see src/domain/commands.ts).
-- Works on the current schema, so the old API can keep running on the same tables.

-- Helpers that must not be callable through the API.
create schema private;
revoke all on schema private from public, anon, authenticated;

-- Admins: users of Supabase Auth allowed to edit. Rows are added by hand
-- (SQL editor or Studio); nobody can change them through the API.
create table public.admins (
	user_id uuid primary key references auth.users (id) on delete cascade,
	created_at timestamptz not null default now()
);
revoke all on table public.admins from anon, authenticated;
alter table public.admins enable row level security;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

create function private.assert_admin()
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
	if not public.is_admin() then
		raise exception 'Brak uprawnień' using errcode = '42501';
	end if;
end;
$$;

create function private.require_point(point_id integer)
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
	if not exists (select 1 from public."MountainPoints" where "Id" = point_id) then
		raise exception 'Nie ma punktu z Id = %', point_id using errcode = 'P0002';
	end if;
end;
$$;

-- Whether the two points are already joined by a chain of ridges (the graph is a forest,
-- so one more ridge between them would close a loop).
create function private.ridge_connects(point_id1 integer, point_id2 integer)
returns boolean
language sql
stable
set search_path = ''
as $$
	with recursive reached(point_id) as (
		select point_id1
		union
		select case when c."PointId1" = r.point_id then c."PointId2" else c."PointId1" end
		from reached r
		join public."PointsConnections" c
			on c."Ridge" and r.point_id in (c."PointId1", c."PointId2")
	)
	select exists (select 1 from reached where point_id = point_id2);
$$;

create function private.insert_connection(point_id1 integer, point_id2 integer)
returns bigint
language plpgsql
set search_path = ''
as $$
declare
	new_id bigint;
begin
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

revoke all on all functions in schema private from public, anon, authenticated;

-- PUT point/{id}
create function public.move_point(point_id integer, latitude numeric, longitude numeric)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	messages text[] := '{}';
begin
	perform private.assert_admin();

	if latitude is null or latitude not between 49.12 and 49.29 then
		messages := array_append(messages, 'Szerokość geograficzna musi być z zakresu <49.12; 49.29>.');
	end if;
	if longitude is null or longitude not between 19.91 and 20.29 then
		messages := array_append(messages, 'Długość geograficzna musi być z zakresu <19.91; 20.29>.');
	end if;
	if cardinality(messages) > 0 then
		raise exception '%', array_to_string(messages, E'\n') using errcode = '22003';
	end if;

	perform private.require_point(point_id);

	update public."MountainPoints"
	set "Latitude" = latitude, "Longitude" = longitude
	where "Id" = point_id;
end;
$$;

-- DELETE point/{id}: the point, its ridges and their routes. Unlike the C# code it also
-- removes the routes' guide descriptions, which used to be left behind.
create function public.delete_point(point_id integer)
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
		and point_id in (c."PointId1", c."PointId2");

	delete from public."PointsConnections" where point_id in ("PointId1", "PointId2");
	delete from public."MountainPoints" where "Id" = point_id;
end;
$$;

-- POST connection: returns the id of the new ridge.
create function public.add_connection(point_id1 integer, point_id2 integer)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
begin
	perform private.assert_admin();
	return private.insert_connection(point_id1, point_id2);
end;
$$;

-- POST route: takes the AddRoute JSON of the route form and returns
-- { routeId, pointsRidge } (pointsRidge only when a new ridge had to be created).
create function public.add_route(route json)
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
		(route ->> 'routeTime')::interval
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

-- Supabase grants execute on new functions in public to anon and authenticated by default.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

revoke execute on function public.move_point(integer, numeric, numeric) from public, anon;
revoke execute on function public.delete_point(integer) from public, anon;
revoke execute on function public.add_connection(integer, integer) from public, anon;
revoke execute on function public.add_route(json) from public, anon;
grant execute on function public.move_point(integer, numeric, numeric) to authenticated;
grant execute on function public.delete_point(integer) to authenticated;
grant execute on function public.add_connection(integer, integer) to authenticated;
grant execute on function public.add_route(json) to authenticated;
