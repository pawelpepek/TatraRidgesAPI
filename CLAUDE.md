# CLAUDE.md

## Project

Graniówki ([graniowki.pl](https://graniowki.pl)) — a map of the Tatra ridges. The user picks two points, the app finds the ridge traverse between them, shows the route variants for each section and computes a trip summary (time, average and maximum difficulty, rank, rappels, warnings, descriptions). An admin edits points, connections and routes.

## Status: migration to Supabase

The rewrite is in progress on the `supabase` branch. Goal: **no .NET, no custom backend** — data and sign-in on Supabase, the logic in the browser.

- `legacy` — frozen pre-migration state (ASP.NET Core API on Azure, C# model, WPF scraper). Do not develop it.
- `firebase` — an abandoned attempt with Firestore. Its domain port was moved here; the Firestore parts (rules, emulator, seed) are not needed.
- Since 2026-10-31 production (graniowki.pl, Firebase Hosting) runs this branch: the frontend reads through `get_tatra_data()` and writes through the SQL functions on Supabase. The old ASP.NET API on Azure is turned off (2026-11), so a rollback to the old frontend is no longer possible and the production schema may change.
- Supabase Auth sign-ups are still enabled on production (`disable_signup: false`); switch them off in the dashboard (Authentication → Sign In / Providers).

| Folder | Role |
|---|---|
| `TatraRidges.FrontEnd/` | React 19 on Vite (TypeScript 7, Redux Toolkit 2, react-leaflet 5, apexcharts, react-tooltip 6), tests in Vitest; deployed to Firebase Hosting |
| `TatraRidges.FrontEnd/src/domain/` | Domain logic ported from C# (see below) |
| `supabase/` | Supabase CLI project: config, migrations, local seed |

## Target architecture

- **Supabase**: Postgres (the existing production database, project ref `ianxfuclpdtcxoeljppt`, region eu-central-1), Supabase Auth for the admin, row level security, SQL functions called through RPC. No Edge Functions unless really needed.
- **Static hosting** of the React build stays on Firebase Hosting (project `graniowki`) for now — Supabase does not host SPAs.
- **Reads**: one RPC, `get_tatra_data()`, returns all points, ridges with routes and dictionaries as JSON in the `TatraData` shape, so `src/domain` and `src/store/local-api.ts` work unchanged.
- **Writes**: admin-only, through SQL functions that check the `admins` table and run in one transaction (e.g. a route with its adjectives and descriptions). Migration `admin_writes` is on production (applied by the user with the SQL editor); the production admin is in `admins`.
- **Build configuration**: `TatraRidges.FrontEnd/.env` holds the production project URL and public anon key (used by `npm run build`); `.env.development` overrides it for `npm start` with the local Supabase. Deploy with `firebase deploy --only hosting` from `TatraRidges.FrontEnd/` (`firebase.json`, `.firebaserc` are in git).
- No user registration — admin sign-in only. Supabase Auth sign-ups must be disabled in the dashboard, and anyone signed in who is not in `admins` is signed out again by the app.

### Local Supabase (`supabase/`)

- Docker Engine and the Supabase CLI (release binary in `~/.local/bin`) run inside WSL 2 (Ubuntu); there is no Docker Desktop. The root `package.json` scripts (`npm run db:start`, `db:stop`, `db:status`, `db:reset`) call the CLI through `wsl bash -lc` from the repository root. WSL forwards the ports, so Windows sees them on `127.0.0.1`.
- WSL stops the distribution (and Docker with the database) when no WSL session is open. `npm run db:start` runs `supabase/start-wsl.sh`, which waits for the containers Docker restarts on its own, runs `supabase start` only if needed and then keeps the session open; keep that terminal running and stop it with Ctrl+C. Data survives restarts. `.gitattributes` keeps `*.sh` files with LF line endings.
- `supabase/config.toml` — Realtime, Storage, Edge Functions and Analytics are off; sign-ups are off through `[auth] enable_signup = false`. Keep `[auth.email] enable_signup = true`: despite the name it switches the whole e-mail provider, sign-in included. API on 54321, Postgres on 54322, Studio on 54323.
- `supabase/migrations/20231225153425_init.sql` — baseline reproducing the production schema created by EF (including `__EFMigrationsHistory`). New schema changes are new migration files; never edit the baseline.
- `supabase/seed.sql` — dictionaries and a small example around Świnica (what the C# `DbSeeder` used to insert), plus a local admin account in `auth.users` and `admins` (its test e-mail and password are in the file's comment). Local only.
- `supabase/migrations/20261025170000_admin_writes.sql` — `public.admins` (user ids from `auth.users`, no API access), `is_admin()` and the writes `move_point`, `delete_point`, `add_connection`, `add_route` (`security definer`, executable by `authenticated` only, each checks `is_admin()` and raises Polish messages with SQL error codes). Helpers live in the schema `private`, which the API cannot reach. Deliberate changes from C#: a ridge from a point to itself is refused, and `delete_point` also removes the guide descriptions of the deleted routes.
- `supabase/migrations/20261031120000_admin_writes_fixes.sql` — replaces `insert_connection`, `delete_point` and `add_route`: adding ridges takes a `share row exclusive` lock on `"PointsConnections"` (no duplicate ridge or loop from concurrent calls), `delete_point` keeps guide descriptions still used by routes of other ridges, `add_route` stores the time in whole minutes. Not yet on production: apply it with the SQL editor.
- `supabase/migrations/20261102120000_fold_guide_descriptions.sql` — folds `"GuideDescriptions"` into `"Routes"` (columns `"GuideId"`, `"GuideNumber"`, `"GuidePage"`, `"GuideVolume"`; descriptions without a route are dropped with the table) and replaces `get_tatra_data()`, `delete_point` (now just deletes the point's ridges, which cascade) and `add_route` (its JSON input still has a nested `guideDescription`, so the frontend is unchanged). `"Routes"."GuideId"` → `"Guides"` is `on delete restrict`: a used guide cannot be deleted. `get_tatra_data()` returns the same JSON as before. Not yet on production: apply it after `admin_writes_fixes` with the SQL editor (dry run with ROLLBACK first).
- `supabase/tests/database/*.test.sql` — pgTAP tests (`npm run db:test`, i.e. `supabase test db`); they create their own rows with ids from 900001 inside a transaction that is rolled back, so they run on seed or imported data alike.
- `supabase/import-prod-data.sh` (`npm run db:import-prod`, `-- --check` to only compare schemas and count rows) — replaces the local data with a copy of production (schema `public`, without `"Users"` data; `admins` is neither copied nor cleared, so the local admin survives). It compares columns only for the tables that exist on production. It reads the connection string (Npgsql format) from `PROD_DB_CONNECTION`, or from `TatraRidgesAPI/appsettings.json` if that file is still there, runs every production session with `default_transaction_read_only=on`, refuses to import if the production columns differ from the local ones, and afterwards moves the local identity sequences past the largest ids. `npm run db:reset` brings back the seed data. If `npm run` crashes in Git Bash, call `wsl bash -l supabase/import-prod-data.sh` directly.
- `supabase/migrations/20261025160000_read_access.sql` — revokes all table and sequence privileges from `anon`/`authenticated` (Supabase grants them by default, including on `"Users"`), enables RLS with no policies on every table, and adds `get_tatra_data()` (`security definer`, `search_path = ''`, executable by `anon`/`authenticated`). Adjectives are returned in physical (`ctid`) order, like EF read them, because the order of adjective groups decides the word order in descriptions. The old API is unaffected: it connects as `postgres`, which owns the tables and has `bypassrls`. Applied to production on 2026-10-25 (dry run with ROLLBACK first; the old API answered the same before and after).
- Every new table in `public` gets the default Supabase grants again: revoke them and enable RLS in the same migration.
- Local Postgres is version 17 (`[db] major_version`), production runs 15.8: don't rely on features newer than 15.

### Production data (checked 2026-10-25)

- 781 points, 777 connections (all ridges), 930 routes, 731 adjective pairs, 2 additional descriptions, 45 adjectives, 1 user. `get_tatra_data()` returns about 530 KB of JSON.
- Every route has its own guide description (confirmed 1:1); 24 descriptions have no route (dropped by `20261102120000_fold_guide_descriptions`).
- Row level security was already enabled (no policies, no FORCE) on all 15 tables in production before our migrations; the local baseline migration has no RLS. Since `20261025160000_read_access` (applied 2026-10-25 with psql, not the CLI) `anon`/`authenticated` hold no table privileges and production serves `get_tatra_data()`.
- There is no `supabase_migrations` schema on production: once the project is linked (`supabase link`, needs `supabase login`), record the applied migrations with `supabase migration repair --status applied 20231225153425 20261025160000` before any `supabase db push`.
- The identity sequences lagged far behind the largest ids (e.g. `MountainPoints` at 18 with ids up to 2072; `AdditionalDescriptions` would have hit a taken id on the 3rd insert). Fixed on production on 2026-10-25 with `supabase/scripts/fix-identity-sequences.sql` (moves each sequence to max id, never backwards; safe to rerun).
- `src/domain` was compared with the live ASP.NET API on this data: 100 random routes (8142 sections) and their summaries gave identical results.

### Current database schema (production)

Created by the EF Core migration `20231225153425_init`, reproduced in `supabase/migrations/`. Table and column names are quoted PascalCase:

- Dictionaries: `"Adjectives"` (`"Id"` varchar(2), `"Text"`, `"Rank"`), `"Difficulties"` (`"Id"`, `"Text"`), `"DifficultyDetails"` (`"Id"`, `"Sign"`), `"Guides"` (`"Id"`, `"ShortName"`, `"Name"`, `"Author"`), `"RouteTypes"` (`"Id"`, `"Name"`, `"Rank"`), `"PointTypes"` (`"Id"`, `"Name"`).
- `"MountainPoints"` (`"Id"`, `"PointTypeId"`, `"Name"`, `"AlternativeName"`, `"Evaluation"` nullable, `"PrecisedEvaluation"`, `"WikiLatitude"`, `"WikiLongitude"`, `"Latitude"`, `"Longitude"` numeric(8,6), `"WikiAddress"`).
- `"PointsConnections"` (`"Id"`, `"PointId1"`, `"PointId2"`, `"Ridge"`) — FKs to points with `ON DELETE RESTRICT`, so a point's connections must be deleted first.
- `"Routes"` (`"Id"`, `"PointsConnectionId"`, `"ConsistentDirection"`, `"DifficultyId"`, `"DifficultyDetailId"`, `"Rappeling"`, `"RouteTypeId"`, `"GuideDescriptionId"`, `"RouteTime"` interval) — cascades from its connection.
- `"GuideDescriptions"` (`"Id"`, `"Number"`, `"Page"`, `"Volume"`, `"GuideId"`) — de facto 1:1 with `"Routes"`. Locally already folded into it by `20261102120000_fold_guide_descriptions` (`"Routes"` has `"GuideId"`, `"GuideNumber"`, `"GuidePage"`, `"GuideVolume"` instead of `"GuideDescriptionId"`).
- `"DescriptionAdjectivePairs"` (`"RouteId"`, `"AdjectiveId"`), `"AdditionalDescriptions"` (`"RouteId"`, `"Description"`, `"Warning"`).
- `"Users"`, `"Roles"` — the old ASP.NET sign-in; replaced by Supabase Auth.

Schema changes must go through migration files in the repo, tried on a non-production database first.

## Domain module (`TatraRidges.FrontEnd/src/domain/`)

Pure TypeScript port of the C# model and API services, with no React or backend dependency. It takes `TatraData` (points, ridges with embedded routes, dictionaries) and returns results in the exact JSON shape the ASP.NET API returned (`routeTime` as a .NET TimeSpan string, e.g. `"1.02:30:00"`), so the Redux slices need no changes.

- `queries.ts` — read side: `getMountainPoints`, `getRidges`, `getRouteBetweenPoints`, `getRouteSummary`, `getParameters`.
- `commands.ts` — admin writes as pure functions (`movePoint`, `deletePoint`, `addConnection`, `addRoute`) with validation and ridge cycle detection. With Supabase the writes will run as SQL functions; these remain the reference and can validate input before sending it.
- `csharpParity.test.ts` compares results with `__fixtures__/csharp-golden.json`: the output of the original C# code (now only on `legacy`) for `__fixtures__/scenarios.json`. Never edit the golden file by hand; a deliberate change gets an explicit override in a test.
- Deliberate change from C#: `getRouteSummary` reports route direction the same way as `getRouteBetweenPoints` (the C# `RoutesConverter` flipped routes stored with `consistentDirection = false`). C# quirk kept on purpose: `Math.Round` rounds halves to even (`roundHalfToEven`).

## Frontend — where things are

- All API calls go through `fetchData` in `src/store/dispatch-actions.js` (dispatched by `props.location`, e.g. `point`, `connection`, `route`, `route/parts`, `route/parameters`, `account/login/`). The Redux slices and `dataDispatcher` should stay unchanged.
- `src/store/local-api.ts` — `handleRequest(props, data)` answers the read requests of the old API with `src/domain`.
- `src/store/supabase-data.ts` — in Supabase mode: login (`account/login/` → `signInWithPassword`, then `is_admin`, returns the access token the UI keeps as "logged in"), the writes (`PUT/DELETE point/`, `POST connection`, `POST route` → the SQL functions, same results as the old API; the connection returns its new id) and the reads through `handleRequest`. The data is loaded again after every write. Logout (`logout` in `user-actions.ts`) also ends the Supabase session. `syncLogin` (dispatched in `index.tsx`) logs the UI out when there is no admin session on page load or the session ends later (`watchAdminSession`).
- With `VITE_SUPABASE_URL` set (`.env` for builds, `.env.development` points it at the local Supabase with the CLI's fixed local publishable key in `VITE_SUPABASE_KEY`), `fetchData` loads `src/store/supabase-data.ts` on demand (the SDK is a separate chunk), which calls `get_tatra_data()` once per page load and passes requests to `handleRequest`. Without it `fetchData` still calls the old ASP.NET API from `src/config.dev.json` (loaded with `import.meta.glob`, so a missing file only fails at request time). So `npm start` needs `npm run db:start` running.
- `src/supabase.ts` — the client.
- Page address: `src/store/url-state.ts` reads and writes `?m=lat,lng,zoom&from=&to=&r=routeId.routeId…&l=1` (`r` only while the route is shown, `l` only for the non-default map layer); `src/store/url-sync.ts` (`startUrlSync` in `index.tsx`) restores the points and route once the points are loaded, then keeps the address in step with `history.replaceState` (no history entries). The section path comes from `from`/`to` (ridges form a tree); `r` only picks variants, matched by route id, and unknown ids fall back to the default variant. `center-slice` takes its initial view and layer from the address.
- Fitting the map to the route: `centerActions.requestRouteFit()` (dispatched after a successful search in `SearchManagePanel` and for a link with a route but no `m`) makes `components/ridge-map/RouteFit.tsx`, inside the `MapContainer`, call `fitBounds` on the route's points (zoom at most 15; skipped while the map is hidden on a phone).
- Tooltips: one `react-tooltip` instance in `App` (`src/components/ui/Tooltip.tsx`, id `tooltip`); elements opt in with `data-tooltip-id="tooltip"` and `data-tooltip-content`.
- Thunks from `dataDispatcher` are dispatched with `useAppDispatch` (`src/hooks/use-app-dispatch.ts`); plain `useDispatch` is typed for plain actions only. `React.lazy` components are declared at module level: created during render they suspend again on every render under React 19.
- `src/store/*-actions.ts` — actions calling `dataDispatcher`; `src/store/authorizationHandler.ts` — current sign-in via a token in `localStorage` (to be replaced by Supabase Auth).
- `src/components/helpers/fetcher.ts` — dead code with `localhost:44342` URLs.

## Commands

From the repository root (local Supabase in WSL):

```bash
npm run db:start     # start local Supabase (migrations + seed.sql on first start) and keep WSL running
npm run db:reset     # recreate the local database from migrations + seed
npm run db:import-prod  # replace local data with a read-only copy of production
npm run db:test      # pgTAP tests of the SQL functions
npm run db:status    # URLs and local keys
npm run db:stop
```

From `TatraRidges.FrontEnd/`:

```bash
npm start            # Vite dev server at http://localhost:3000
npm test             # Vitest (watch); `npx vitest run` for one run
npm run build        # tsc, then vite build into build/
firebase deploy --only hosting
```

## Files outside git

Ignored, do not commit or print: `TatraRidges.FrontEnd/src/config.dev.json`, the leftover `TatraRidgesAPI/appsettings.json`, if present (connection string with the password of the production Supabase `postgres` user — read only the host if needed, never the password) and `TatraRidgesAPI/*.PublishSettings` (Azure deploy credentials). Keep Supabase service role keys and database passwords out of the repo; the anon key and project URL are public by design.

## Conventions

- UI text, error messages and commit messages are in Polish.
- Domain results must stay identical to the C# implementation unless a change is deliberate; `csharpParity.test.ts` guards this.
- Frontend code is formatted with Prettier: tabs, no semicolons, `arrowParens: avoid`, `trailingComma: es5`.
