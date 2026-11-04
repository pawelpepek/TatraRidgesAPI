// Supabase without the SDK: the configuration, the public reads and a check for a
// stored admin session. Visitors only need this; the SDK (supabase.ts) is loaded
// for the admin's sign-in and writes.
//
// The project URL and the publishable (anon) key are public by design; access is
// limited by grants and row level security in the database (see supabase/migrations).

export const getSupabaseConfig = () => {
	const url = import.meta.env.VITE_SUPABASE_URL ?? ""
	const key = import.meta.env.VITE_SUPABASE_KEY ?? ""
	if (!/^https?:\/\/[^\s=]+$/.test(url)) {
		throw new Error(`Niepoprawny adres Supabase w VITE_SUPABASE_URL: "${url}"`)
	}
	if (key === "") {
		throw new Error("Brak klucza Supabase w VITE_SUPABASE_KEY")
	}
	return { url: url.replace(/\/+$/, ""), key }
}

// Where supabase-js keeps the session (its default key, set explicitly in supabase.ts
// so that the check below does not depend on the SDK's internals).
export const authStorageKey = (url: string) =>
	`sb-${new URL(url).hostname.split(".")[0]}-auth-token`

// Whether a session may exist; only then is the SDK loaded on page load.
export const hasStoredSession = () => {
	try {
		const { url } = getSupabaseConfig()
		return localStorage.getItem(authStorageKey(url)) !== null
	} catch {
		return false
	}
}

// Calls a SQL function as anon, like supabase.rpc() without a session.
// Errors carry the database's message, as the SDK reports them.
export const publicRpc = async <T>(fn: string): Promise<T> => {
	const { url, key } = getSupabaseConfig()
	const response = await fetch(`${url}/rest/v1/rpc/${fn}`, {
		method: "POST",
		headers: { apikey: key, "Content-Type": "application/json" },
		body: "{}",
	})
	if (!response.ok) {
		const error = await response.json().catch(() => null)
		throw new Error(error?.message ?? `HTTP ${response.status}`)
	}
	return response.json()
}
