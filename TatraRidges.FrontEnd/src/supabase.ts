import { createClient, SupabaseClient } from "@supabase/supabase-js"

// The project URL and the publishable (anon) key are public by design; access is
// limited by grants and row level security in the database (see supabase/migrations).
// The admin's session is kept in localStorage by supabase-js.

let client: SupabaseClient | null = null

// Created on first use and checked here: a client that fails while the module loads
// leaves the importing modules half-initialised ("Cannot access … before initialization").
export const getSupabase = () => {
	if (client === null) {
		const url = import.meta.env.VITE_SUPABASE_URL ?? ""
		const key = import.meta.env.VITE_SUPABASE_KEY ?? ""
		if (!/^https?:\/\/[^\s=]+$/.test(url)) {
			throw new Error(
				`Niepoprawny adres Supabase w VITE_SUPABASE_URL: "${url}"`
			)
		}
		if (key === "") {
			throw new Error("Brak klucza Supabase w VITE_SUPABASE_KEY")
		}
		client = createClient(url, key)
	}
	return client
}
