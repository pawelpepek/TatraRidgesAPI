# TatraRidges

A map of the ridges of the Tatra Mountains. Pick two points and the app finds the ridge traverse between them, lists the route variants for each section and sums up the whole trip: time, average and maximum difficulty, rank, rappels, warnings and descriptions.

Live at [graniowki.pl](https://graniowki.pl).

## Status: moving to Supabase

The project is being rewritten without a custom backend:

- **Supabase** keeps the Postgres database and handles the admin sign-in.
- Ridge search and route summaries run in the browser, in TypeScript.
- The React app stays on static hosting (Firebase Hosting).

The previous version (ASP.NET Core API, C# model and a WPF Wikipedia scraper) is kept on the [`legacy`](https://github.com/pawelpepek/TatraRidgesAPI/tree/legacy) branch.

## Hosting history

The app has moved through four setups, each one dropping a piece of infrastructure:

1. **SQL Server on Azure + ASP.NET Core Web API on Azure** (2021–2023). The original version: a C# model with Entity Framework Core on SQL Server on Azure, a Web API on Azure App Service and the React app calling it.
2. **ElephantSQL Postgres** (December 2023). The database moved from SQL Server to PostgreSQL hosted on ElephantSQL (EF Core switched from `UseSqlServer` to `UseNpgsql`, migration `20231225153425_init`). The Web API stayed on Azure.
3. **Supabase database** (2025). After ElephantSQL ended its service, the same Postgres schema moved to Supabase. Only the connection string changed: the Web API on Azure kept talking to the database through EF Core.
4. **Supabase serverless** (October 2026). No custom backend any more: the C# logic was ported to TypeScript and runs in the browser, the frontend reads all data with one SQL function (`get_tatra_data()`), the admin signs in with Supabase Auth and writes go through SQL functions guarded by row level security. The React app is served from Firebase Hosting. The Azure API still runs on the same database but nothing calls it, and it will be switched off.

## Repository layout

| Folder | Contents |
|---|---|
| `TatraRidges.FrontEnd/` | React app (Create React App, Redux Toolkit, Leaflet) |
| `TatraRidges.FrontEnd/src/domain/` | Ridge search and route summaries, ported from C# |

## Running the frontend

```bash
cd TatraRidges.FrontEnd
npm install
npm start
```

The app runs at http://localhost:3000. Tests: `npm test`, production build: `npm run build`.

## License

[MIT](LICENSE)
