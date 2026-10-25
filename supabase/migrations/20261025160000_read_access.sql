-- Read access for the browser app.
--
-- By Supabase defaults the anon and authenticated roles had full privileges on every
-- table in public (including "Users" with password hashes). From now on they have no
-- direct table access; the app reads everything through get_tatra_data().
--
-- Safe while the old ASP.NET API still runs: it connects as postgres, which owns the
-- tables and bypasses row level security.

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- Second line of defence: with RLS on and no policies, nothing is visible even if a
-- privilege is granted again later (Supabase grants them by default on new tables).
alter table public."Adjectives" enable row level security;
alter table public."AdditionalDescriptions" enable row level security;
alter table public."DescriptionAdjectivePairs" enable row level security;
alter table public."Difficulties" enable row level security;
alter table public."DifficultyDetails" enable row level security;
alter table public."GuideDescriptions" enable row level security;
alter table public."Guides" enable row level security;
alter table public."MountainPoints" enable row level security;
alter table public."PointTypes" enable row level security;
alter table public."PointsConnections" enable row level security;
alter table public."Roles" enable row level security;
alter table public."RouteTypes" enable row level security;
alter table public."Routes" enable row level security;
alter table public."Users" enable row level security;
alter table public."__EFMigrationsHistory" enable row level security;

-- All data the app needs, in the TatraData shape of TatraRidges.FrontEnd/src/domain/types.ts:
-- points, ridges with their routes (guide description folded in) and dictionaries.
create function public.get_tatra_data()
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
						'guideId', g."GuideId",
						'guideNumber', g."Number",
						'guidePage', g."Page",
						'guideVolume', g."Volume",
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
					join public."GuideDescriptions" g on g."Id" = r."GuideDescriptionId"
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

revoke execute on function public.get_tatra_data() from public;
grant execute on function public.get_tatra_data() to anon, authenticated;
