export {}

const getSupabaseWith = async (url: string, key: string) => {
	vi.stubEnv("VITE_SUPABASE_URL", url)
	vi.stubEnv("VITE_SUPABASE_KEY", key)
	vi.resetModules()
	return (await import("./supabase")).getSupabase
}

afterEach(() => {
	vi.unstubAllEnvs()
})

describe("getSupabase", () => {
	it.each([
		["VITE_SUPABASE_URL=https://abc.supabase.co"],
		["abc.supabase.co"],
		[""],
	])("names a wrong project URL %p", async url => {
		const getSupabase = await getSupabaseWith(url, "key")
		expect(getSupabase).toThrow(
			`Niepoprawny adres Supabase w VITE_SUPABASE_URL: "${url}"`
		)
	})

	it("names a missing key", async () => {
		const getSupabase = await getSupabaseWith("https://abc.supabase.co", "")
		expect(getSupabase).toThrow(
			"Brak klucza Supabase w VITE_SUPABASE_KEY"
		)
	})

	it("creates one client for a valid configuration", async () => {
		const getSupabase = await getSupabaseWith("http://127.0.0.1:54321", "key")
		expect(getSupabase()).toBe(getSupabase())
	})
})
