# TatraRidges

A map of the ridges of the Tatra Mountains. Pick two points and the app finds the ridge traverse between them, lists the route variants for each section and sums up the whole trip: time, average and maximum difficulty, rank, rappels, warnings and descriptions.

Live at [graniowki.pl](https://graniowki.pl).

## Status: moving to Supabase

The project is being rewritten without a custom backend:

- **Supabase** keeps the Postgres database and handles the admin sign-in.
- Ridge search and route summaries run in the browser, in TypeScript.
- The React app stays on static hosting (Firebase Hosting).

The previous version (ASP.NET Core API, C# model and a WPF Wikipedia scraper) is kept on the [`legacy`](https://github.com/pawelpepek/TatraRidgesAPI/tree/legacy) branch.

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
