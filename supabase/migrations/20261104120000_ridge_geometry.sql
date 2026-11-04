-- Ridge lines and elevation profiles from the airborne laser scan (NMT GUGiK), computed by
-- tools/elevation (export_sql.py writes the UPDATE statements), not by the app.
--
-- "Line": jsonb [[lat, lng], ...] from PointId1 to PointId2, simplified so the line bends only
-- where the ridge really turns; the first and last vertex are the points' coordinates.
-- "Profile": smallint[] heights in whole metres every 2 m along the exact ridge from PointId1.
-- Both stay null for ridges without data (e.g. outside Poland); the app then draws a straight line.
-- get_tatra_data() is unchanged: the app loads this separately, after the map is shown.

alter table public."PointsConnections"
	add column "Line" jsonb,
	add column "Profile" smallint[];

-- A moved point no longer fits its ridges' lines: drop them until the script computes them again.
-- A trigger rather than a change in move_point, so it holds for any update of the coordinates.
create function private.clear_ridge_geometry()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
	update public."PointsConnections"
	set "Line" = null, "Profile" = null
	where ("PointId1" = new."Id" or "PointId2" = new."Id")
		and ("Line" is not null or "Profile" is not null);
	return null;
end;
$$;

revoke all on function private.clear_ridge_geometry() from public, anon, authenticated;

create trigger clear_ridge_geometry
after update of "Latitude", "Longitude" on public."MountainPoints"
for each row
when (old."Latitude" is distinct from new."Latitude" or old."Longitude" is distinct from new."Longitude")
execute function private.clear_ridge_geometry();

-- [{ "id": connection id, "line": [[lat, lng], ...], "profile": [m, ...] }, ...] for ridges with both.
create function public.get_ridge_geometry()
returns json
language sql
stable
security definer
set search_path = ''
as $$
	select coalesce(
		json_agg(json_build_object('id', c."Id", 'line', c."Line", 'profile', c."Profile") order by c."Id"),
		'[]'::json)
	from public."PointsConnections" c
	where c."Line" is not null and c."Profile" is not null;
$$;

revoke execute on function public.get_ridge_geometry() from public;
grant execute on function public.get_ridge_geometry() to anon, authenticated;
