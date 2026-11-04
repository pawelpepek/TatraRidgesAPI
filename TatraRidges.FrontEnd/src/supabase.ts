import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { authStorageKey, getSupabaseConfig } from "./supabase-rest"

// The SDK client, for the admin only (sign-in, session, writes); visitors read
// through supabase-rest.ts. The admin's session is kept in localStorage by supabase-js.

let client: SupabaseClient | null = null

// Created on first use and checked here: a client that fails while the module loads
// leaves the importing modules half-initialised ("Cannot access … before initialization").
export const getSupabase = () => {
	if (client === null) {
		const { url, key } = getSupabaseConfig()
		client = createClient(url, key, {
			auth: { storageKey: authStorageKey(url) },
		})
	}
	return client
}
