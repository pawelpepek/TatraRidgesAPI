# Graniówki — front

React 19 + Vite. Dane i logowanie z Supabase (adres i klucz publiczny w `.env`, lokalnie w `.env.development`).

```bash
npm start        # serwer deweloperski na http://localhost:3000 (wymaga `npm run db:start` w katalogu głównym)
npm test         # testy Vitest w trybie watch
npm run build    # sprawdzenie typów i build do build/
npm run preview  # podgląd buildu
firebase deploy --only hosting
```
