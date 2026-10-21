# CLAUDE.md

## Project

Graniówki ([graniowki.pl](https://graniowki.pl)) — a map of the Tatra ridges. The user picks two points, the app finds the ridge traverse between them, shows the route variants for each section and computes a trip summary (time, average and maximum difficulty, rank, rappels, warnings, descriptions). An admin edits points, connections and routes.

## Status: migration to Firebase (serverless)

The rewrite is in progress on the `firebase` branch. Goal: **everything on Firebase, no .NET, no custom backend**. The pre-migration state (ASP.NET backend + PostgreSQL on Azure, WPF scraper) is frozen on the `legacy` branch — do not develop it further.

| Folder | Role | Fate |
|---|---|---|
| `TatraRidges.FrontEnd/` | React (CRA 5, React 17, Redux Toolkit, react-leaflet, apexcharts), Firebase Hosting | Stays and takes over all the logic |
| `TatraRidgesModel/` | EF entities, domain logic in C# | Reference source for the TS port, then removed |
| `TatraRidges.Model.UnitTests/` | Domain logic tests (xUnit) | Port to Jest with the same cases, then remove |
| `TatraRidgesAPI/` | ASP.NET Core 6 API | To be removed |
| `TatraRidgesAPI.IntegrationTests/` | API tests | To be removed (replaced by security rules tests on the emulator) |

## Target architecture

- **Firebase Hosting** (project `graniowki`) + **Firestore** + **Firebase Auth**. No Cloud Functions — it must run on the Spark plan.
- **Domain logic in TypeScript in the browser.** The backend already kept the whole database in memory (`CashService`) and computed on it; now the client does that after loading the data. To port, among others: ridge search (`Procedures/SearchModel/Points` — pruning graph leaves, `RidgeFinder`), `RouteArranger`, `Helpers/RouteSummary/*`, `DifficultyConverter`/`DifficultyHandler`, `WarningsAdjectives`, coordinate validation (`MountainPointValidator`), ridge cycle detection (`ConnectionCreator`).
- **Writes are admin-only**, directly to Firestore in transactions. Admin = a UID listed in the `config/admins` document, checked in the security rules (no custom claims, no Admin SDK at runtime). Reads are public.
- No user registration — admin sign-in only.

### Firestore data model

Denormalized for the "load everything" access pattern — one page visit is 3 reads:

```
public/points  → { items: [ { id, name, altName, evaluation, precisedEvaluation, lat, lng, wikiLat, wikiLng, wikiAddress, pointTypeId } ] }
public/ridges  → { items: [ { id, pointId1, pointId2, routes: [ {
                     id, consistentDirection, difficultyId, difficultyDetailId, rappeling, routeTypeId, routeTimeMin,
                     guideId, guideNumber, guidePage, guideVolume,
                     adjectiveIds: [...], additional: [ { description, warning } ] } ] } ] }
public/params  → { adjectives, difficulties, difficultyDetails, guides, routeTypes, pointTypes }
config/admins  → { uids: [...] }
```

Decisions:
- The `GuideDescriptions` table was de facto 1:1 with `Routes` (every route creates its own description) — its fields are folded into the route (`guide*`).
- `DescriptionAdjectivePairs` → `adjectiveIds` array on the route; `RouteTime` (`TimeSpan`) → `routeTimeMin` (number of minutes).
- `Users`/`Roles` go away (Firebase Auth).
- IDs stay numeric (the frontend relies on them); new ID = `max + 1` inside a transaction.
- Firestore's document limit is 1 MB — watch the size of `public/ridges` when changing the model.

### Data migration

The Firebase console cannot import JSON into Firestore. Plan: SQL queries (`json_agg`/`json_build_object`) export Postgres straight into the target JSON shape, and a one-off Node script using `firebase-admin` (planned in `tools/migration/`) writes the documents — against the emulator first. Before migrating, run check queries to confirm `Routes.GuideDescriptionId` is unique and there are no orphaned descriptions.

## Frontend — where things are

- All API calls go through `fetchData` in `src/store/dispatch-actions.js` (dispatched by `props.location`, e.g. `point`, `connection`, `route`, `route/parts`, `route/parameters`, `account/login/`). This is where Firestore and the local logic get plugged in — the Redux slices and `dataDispatcher` should stay unchanged.
- `src/store/*-actions.ts` — actions calling `dataDispatcher`; `src/store/authorizationHandler.ts` — current sign-in via a token in `localStorage` (to be replaced by Firebase Auth).
- `src/components/helpers/fetcher.ts` — dead code with `localhost:44342` URLs.

## Commands

From `TatraRidges.FrontEnd/`:

```bash
npm start            # dev server at http://localhost:3000
npm test             # Jest (watch)
npm run build
firebase deploy --only hosting
```

## Files outside git

Ignored in the root `.gitignore`, do not commit: `TatraRidges.FrontEnd/firebase.json`, `TatraRidges.FrontEnd/.firebaserc`, `TatraRidges.FrontEnd/src/config.dev.json`, `TatraRidgesAPI/appsettings.json` (connection string to the production database — don't read it unless needed). Keep Firebase service account keys out of the repo too.

## Conventions

- UI text, error messages and commit messages are in Polish.
- When porting logic from C#, keep the results identical; the tests in `TatraRidges.Model.UnitTests/` are the specification.
