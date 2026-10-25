# CLAUDE.md

## Project

Graniówki ([graniowki.pl](https://graniowki.pl)) — a map of the Tatra ridges. The user picks two points, the app finds the ridge traverse between them, shows the route variants for each section and computes a trip summary (time, average and maximum difficulty, rank, rappels, warnings, descriptions). An admin edits points, connections and routes.

## Status: migration to Supabase

The rewrite is in progress on the `supabase` branch. Goal: **no .NET, no custom backend** — data and sign-in on Supabase, the logic in the browser.

- `legacy` — frozen pre-migration state (ASP.NET Core API on Azure, C# model, WPF scraper). Do not develop it.
- `firebase` — an abandoned attempt with Firestore. Its domain port was moved here; the Firestore parts (rules, emulator, seed) are not needed.
- Production still runs the old stack: the deployed frontend calls the ASP.NET API on Azure, which uses the Supabase Postgres database.

| Folder | Role |
|---|---|
| `TatraRidges.FrontEnd/` | React (CRA 5, React 17, Redux Toolkit, react-leaflet, apexcharts), deployed to Firebase Hosting |
| `TatraRidges.FrontEnd/src/domain/` | Domain logic ported from C# (see below) |
| `supabase/` | Supabase CLI project: config, migrations, local seed |

## Target architecture

- **Supabase**: Postgres (the existing production database, project ref `ianxfuclpdtcxoeljppt`, region eu-central-1), Supabase Auth for the admin, row level security, SQL functions called through RPC. No Edge Functions unless really needed.
- **Static hosting** of the React build stays on Firebase Hosting (project `graniowki`) for now — Supabase does not host SPAs.
- **Reads**: one RPC, `get_tatra_data()`, returns all points, ridges with routes and dictionaries as JSON in the `TatraData` shape, so `src/domain` and `src/store/local-api.ts` work unchanged.
- **Writes**: admin-only, through SQL functions that check an `admins` table (planned) and run in one transaction (e.g. a route with its adjectives and descriptions).
- No user registration — admin sign-in only. Supabase Auth sign-ups must be disabled in the dashboard.

### Local Supabase (`supabase/`)

- Docker Engine and the Supabase CLI (release binary in `~/.local/bin`) run inside WSL 2 (Ubuntu); there is no Docker Desktop. The root `package.json` scripts (`npm run db:start`, `db:stop`, `db:status`, `db:reset`) call the CLI through `wsl bash -lc` from the repository root. WSL forwards the ports, so Windows sees them on `127.0.0.1`.
- WSL stops the distribution (and Docker with the database) when no WSL session is open. `npm run db:start` runs `supabase/start-wsl.sh`, which waits for the containers Docker restarts on its own, runs `supabase start` only if needed and then keeps the session open; keep that terminal running and stop it with Ctrl+C. Data survives restarts. `.gitattributes` keeps `*.sh` files with LF line endings.
- `supabase/config.toml` — Realtime, Storage, Edge Functions and Analytics are off; Auth sign-ups are off (create the admin in Studio, http://127.0.0.1:54323). API on 54321, Postgres on 54322.
- `supabase/migrations/20231225153425_init.sql` — baseline reproducing the production schema created by EF (including `__EFMigrationsHistory`). New schema changes are new migration files; never edit the baseline.
- `supabase/seed.sql` — dictionaries and a small example around Świnica (what the C# `DbSeeder` used to insert). Local only.
- `supabase/import-prod-data.sh` (`npm run db:import-prod`, `-- --check` to only compare schemas and count rows) — replaces the local data with a copy of production (schema `public`, without `"Users"` data). It reads the connection string from `TatraRidgesAPI/appsettings.json` (or `PROD_DB_CONNECTION`), runs every production session with `default_transaction_read_only=on`, refuses to import if the production columns differ from the local ones, and afterwards moves the local identity sequences past the largest ids. `npm run db:reset` brings back the seed data. If `npm run` crashes in Git Bash, call `wsl bash -l supabase/import-prod-data.sh` directly.
- `supabase/migrations/20261025160000_read_access.sql` — revokes all table and sequence privileges from `anon`/`authenticated` (Supabase grants them by default, including on `"Users"`), enables RLS with no policies on every table, and adds `get_tatra_data()` (`security definer`, `search_path = ''`, executable by `anon`/`authenticated`). Adjectives are returned in physical (`ctid`) order, like EF read them, because the order of adjective groups decides the word order in descriptions. The old API is unaffected: it connects as `postgres`, which owns the tables and has `bypassrls`. Not applied to production yet.
- Every new table in `public` gets the default Supabase grants again: revoke them and enable RLS in the same migration.
- Local Postgres is version 17 (`[db] major_version`), production runs 15.8: don't rely on features newer than 15.

### Production data (checked 2026-10-25)

- 781 points, 777 connections (all ridges), 930 routes, 731 adjective pairs, 2 additional descriptions, 45 adjectives, 1 user. `get_tatra_data()` returns about 530 KB of JSON.
- Every route has its own guide description (confirmed 1:1); 24 descriptions have no route and can be dropped when folding them into `"Routes"`.
- The identity sequences lagged far behind the largest ids (e.g. `MountainPoints` at 18 with ids up to 2072; `AdditionalDescriptions` would have hit a taken id on the 3rd insert). Fixed on production on 2026-10-25 with `supabase/scripts/fix-identity-sequences.sql` (moves each sequence to max id, never backwards; safe to rerun).
- `src/domain` was compared with the live ASP.NET API on this data: 100 random routes (8142 sections) and their summaries gave identical results.

### Current database schema (production)

Created by the EF Core migration `20231225153425_init`, reproduced in `supabase/migrations/`. Table and column names are quoted PascalCase:

- Dictionaries: `"Adjectives"` (`"Id"` varchar(2), `"Text"`, `"Rank"`), `"Difficulties"` (`"Id"`, `"Text"`), `"DifficultyDetails"` (`"Id"`, `"Sign"`), `"Guides"` (`"Id"`, `"ShortName"`, `"Name"`, `"Author"`), `"RouteTypes"` (`"Id"`, `"Name"`, `"Rank"`), `"PointTypes"` (`"Id"`, `"Name"`).
- `"MountainPoints"` (`"Id"`, `"PointTypeId"`, `"Name"`, `"AlternativeName"`, `"Evaluation"` nullable, `"PrecisedEvaluation"`, `"WikiLatitude"`, `"WikiLongitude"`, `"Latitude"`, `"Longitude"` numeric(8,6), `"WikiAddress"`).
- `"PointsConnections"` (`"Id"`, `"PointId1"`, `"PointId2"`, `"Ridge"`) — FKs to points with `ON DELETE RESTRICT`, so a point's connections must be deleted first.
- `"Routes"` (`"Id"`, `"PointsConnectionId"`, `"ConsistentDirection"`, `"DifficultyId"`, `"DifficultyDetailId"`, `"Rappeling"`, `"RouteTypeId"`, `"GuideDescriptionId"`, `"RouteTime"` interval) — cascades from its connection.
- `"GuideDescriptions"` (`"Id"`, `"Number"`, `"Page"`, `"Volume"`, `"GuideId"`) — de facto 1:1 with `"Routes"`; to be folded into it.
- `"DescriptionAdjectivePairs"` (`"RouteId"`, `"AdjectiveId"`), `"AdditionalDescriptions"` (`"RouteId"`, `"Description"`, `"Warning"`).
- `"Users"`, `"Roles"` — the old ASP.NET sign-in; replaced by Supabase Auth.

Schema changes must go through migration files in the repo, tried on a non-production database first. Never change the production schema while the old API still runs on it.

## Domain module (`TatraRidges.FrontEnd/src/domain/`)

Pure TypeScript port of the C# model and API services, with no React or backend dependency. It takes `TatraData` (points, ridges with embedded routes, dictionaries) and returns results in the exact JSON shape the ASP.NET API returned (`routeTime` as a .NET TimeSpan string, e.g. `"1.02:30:00"`), so the Redux slices need no changes.

- `queries.ts` — read side: `getMountainPoints`, `getRidges`, `getRouteBetweenPoints`, `getRouteSummary`, `getParameters`.
- `commands.ts` — admin writes as pure functions (`movePoint`, `deletePoint`, `addConnection`, `addRoute`) with validation and ridge cycle detection. With Supabase the writes will run as SQL functions; these remain the reference and can validate input before sending it.
- `csharpParity.test.ts` compares results with `__fixtures__/csharp-golden.json`: the output of the original C# code (now only on `legacy`) for `__fixtures__/scenarios.json`. Never edit the golden file by hand; a deliberate change gets an explicit override in a test.
- Deliberate change from C#: `getRouteSummary` reports route direction the same way as `getRouteBetweenPoints` (the C# `RoutesConverter` flipped routes stored with `consistentDirection = false`). C# quirk kept on purpose: `Math.Round` rounds halves to even (`roundHalfToEven`).

## Frontend — where things are

- All API calls go through `fetchData` in `src/store/dispatch-actions.js` (dispatched by `props.location`, e.g. `point`, `connection`, `route`, `route/parts`, `route/parameters`, `account/login/`). The Redux slices and `dataDispatcher` should stay unchanged.
- `src/store/local-api.ts` — `handleRequest(props, data)` answers the read requests of the old API with `src/domain`; writes and login throw until they are implemented.
- With `REACT_APP_SUPABASE_URL` set (`.env.development` points it at the local Supabase, with the CLI's fixed local publishable key in `REACT_APP_SUPABASE_KEY`), `fetchData` loads `src/store/supabase-data.ts` on demand (the SDK is a separate chunk), which calls `get_tatra_data()` once per page load and passes requests to `handleRequest`. Without it (production builds until the cutover) `fetchData` still calls the ASP.NET API from `config.dev.json`. So `npm start` needs `npm run db:start` running.
- `src/supabase.ts` — the client. `src/types/supabase-js.d.ts` declares the few supabase-js APIs in use, because the package ships `.d.cts` types that TypeScript 4.5 (CRA 5) cannot read; remove it after upgrading TypeScript.
- `src/store/*-actions.ts` — actions calling `dataDispatcher`; `src/store/authorizationHandler.ts` — current sign-in via a token in `localStorage` (to be replaced by Supabase Auth).
- `src/components/helpers/fetcher.ts` — dead code with `localhost:44342` URLs.

## Commands

From the repository root (local Supabase in WSL):

```bash
npm run db:start     # start local Supabase (migrations + seed.sql on first start) and keep WSL running
npm run db:reset     # recreate the local database from migrations + seed
npm run db:import-prod  # replace local data with a read-only copy of production
npm run db:status    # URLs and local keys
npm run db:stop
```

From `TatraRidges.FrontEnd/`:

```bash
npm start            # dev server at http://localhost:3000
npm test             # Jest (watch)
npm run build
firebase deploy --only hosting
```

## Files outside git

Ignored, do not commit or print: `TatraRidges.FrontEnd/src/config.dev.json`, the leftover `TatraRidgesAPI/appsettings.json` (connection string with the password of the production Supabase `postgres` user — read only the host if needed, never the password) and `TatraRidgesAPI/*.PublishSettings` (Azure deploy credentials). Keep Supabase service role keys and database passwords out of the repo; the anon key and project URL are public by design.

## Conventions

- UI text, error messages and commit messages are in Polish.
- Domain results must stay identical to the C# implementation unless a change is deliberate; `csharpParity.test.ts` guards this.
- Frontend code is formatted with Prettier: tabs, no semicolons, `arrowParens: avoid`, `trailingComma: es5`.
