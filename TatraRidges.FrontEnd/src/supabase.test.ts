export {}

const env = { ...process.env }

const getSupabaseWith = (url?: string, key?: string) => {
	process.env.REACT_APP_SUPABASE_URL = url
	process.env.REACT_APP_SUPABASE_KEY = key
	let getSupabase: typeof import("./supabase").getSupabase | undefined
	jest.isolateModules(() => {
		getSupabase = require("./supabase").getSupabase
	})
	return getSupabase!
}

afterEach(() => {
	process.env = { ...env }
})

describe("getSupabase", () => {
	it.each([
		["REACT_APP_SUPABASE_URL=https://abc.supabase.co"],
		["abc.supabase.co"],
		[""],
	])("names a wrong project URL %p", url => {
		expect(() => getSupabaseWith(url, "key")()).toThrow(
			`Niepoprawny adres Supabase w REACT_APP_SUPABASE_URL: "${url}"`
		)
	})

	it("names a missing key", () => {
		expect(() => getSupabaseWith("https://abc.supabase.co", "")()).toThrow(
			"Brak klucza Supabase w REACT_APP_SUPABASE_KEY"
		)
	})

	it("creates one client for a valid configuration", () => {
		const getSupabase = getSupabaseWith("http://127.0.0.1:54321", "key")
		expect(getSupabase()).toBe(getSupabase())
	})
})
