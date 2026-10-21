# TatraRidges

A map of the ridges of the Tatra Mountains. Pick two points and the app finds the ridge traverse between them, lists the route variants for each section and sums up the whole trip: time, average and maximum difficulty, rank, rappels, warnings and descriptions.

Live at [graniowki.pl](https://graniowki.pl).

## Status: moving to Firebase

The project is being rewritten to run entirely on Firebase, with no custom backend:

- **Firebase Hosting** serves the React app.
- **Firestore** stores points, ridges with their routes, and dictionaries.
- **Firebase Auth** handles the admin sign-in.
- Ridge search and route summaries run in the browser, in TypeScript.

The previous version (ASP.NET Core API + PostgreSQL, plus a WPF Wikipedia scraper) is kept on the [`legacy`](https://github.com/pawelpepek/TatraRidgesAPI/tree/legacy) branch.

## Repository layout

| Folder | Contents |
|---|---|
| `TatraRidges.FrontEnd/` | React app (Create React App, Redux Toolkit, Leaflet) |
| `TatraRidgesModel/` | Domain logic in C#, the reference for the TypeScript port (to be removed) |
| `TatraRidges.Model.UnitTests/` | Tests of the domain logic (to be ported to Jest) |
| `TatraRidgesAPI/`, `TatraRidgesAPI.IntegrationTests/` | Legacy ASP.NET Core API (to be removed) |

## Running the frontend

```bash
cd TatraRidges.FrontEnd
npm install
npm start
```

The app runs at http://localhost:3000. Tests: `npm test`, production build: `npm run build`.

## License

[MIT](LICENSE)
