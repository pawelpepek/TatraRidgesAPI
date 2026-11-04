import { Mock } from "vitest"
import { data } from "../domain/__fixtures__/scenarioData"

vi.mock("../supabase", () => {
	const supabase = {
		rpc: vi.fn(),
		auth: {
			signInWithPassword: vi.fn(),
			signOut: vi.fn(),
			getSession: vi.fn(),
			onAuthStateChange: vi.fn(),
		},
	}
	return { supabase, getSupabase: () => supabase }
})

const sessionKey = "sb-abc-auth-token"

// A fresh module per test: supabase-data keeps the loaded data in a module variable.
// Reads go through fetch (mocked as `http`), the admin's calls through the SDK (`rpc`).
const setup = async () => {
	vi.resetModules()
	vi.stubEnv("VITE_SUPABASE_URL", "https://abc.supabase.co")
	vi.stubEnv("VITE_SUPABASE_KEY", "key")
	const http = vi.fn(async (url: string) =>
		url.endsWith("/get_tatra_data")
			? new Response(JSON.stringify(data))
			: new Response(JSON.stringify([]))
	)
	vi.stubGlobal("fetch", http)
	const module = await import("./supabase-data")
	const client: any = ((await import("../supabase")) as any).supabase
	const rpc = client.rpc as Mock
	rpc.mockReset()
	rpc.mockImplementation(async (fn: string) =>
		fn === "is_admin" ? { data: true, error: null } : { data: null, error: null }
	)
	client.auth.onAuthStateChange.mockReset()
	client.auth.getSession.mockReset()
	client.auth.signOut.mockReset()
	return {
		fetch: module.fetchFromSupabase,
		watch: module.watchAdminSession,
		loadGeometry: module.loadRidgeGeometry,
		client,
		rpc,
		http,
	}
}

afterEach(() => {
	vi.unstubAllEnvs()
	vi.unstubAllGlobals()
	localStorage.clear()
})

const dataLoads = (http: Mock) =>
	http.mock.calls.filter(([url]) => url.endsWith("/get_tatra_data")).length

describe("fetchFromSupabase", () => {
	it("answers reads from one get_tatra_data call, without the SDK", async () => {
		const { fetch, rpc, http } = await setup()
		const points = await fetch({ method: "GET", location: "point" })
		await fetch({ method: "GET", location: "connection" })
		expect(points).toHaveLength(data.points.length)
		expect(dataLoads(http)).toBe(1)
		expect(http).toHaveBeenCalledWith(
			"https://abc.supabase.co/rest/v1/rpc/get_tatra_data",
			expect.objectContaining({
				method: "POST",
				headers: expect.objectContaining({ apikey: "key" }),
			})
		)
		expect(rpc).not.toHaveBeenCalled()
	})

	it("reports a failed read with the database's message", async () => {
		const { fetch, http } = await setup()
		http.mockResolvedValueOnce(
			new Response(JSON.stringify({ message: "permission denied" }), {
				status: 401,
			})
		)
		await expect(fetch({ method: "GET", location: "point" })).rejects.toThrow(
			"Błąd odczytu danych: permission denied"
		)
		// The failed load is not kept: the next read tries again.
		expect(await fetch({ method: "GET", location: "point" })).toHaveLength(
			data.points.length
		)
	})

	it("loads the ridge geometry without the SDK", async () => {
		const { loadGeometry, rpc, http } = await setup()
		expect(await loadGeometry()).toEqual([])
		expect(http.mock.calls[0][0]).toBe(
			"https://abc.supabase.co/rest/v1/rpc/get_ridge_geometry"
		)
		expect(rpc).not.toHaveBeenCalled()
	})

	it("moves a point and reloads the data afterwards", async () => {
		const { fetch, rpc, http } = await setup()
		await fetch({ method: "GET", location: "point" })

		const result = await fetch({
			method: "PUT",
			location: "point/",
			pathPart: 5,
			body: { latitude: 49.2, longitude: 20.1 },
		})
		await fetch({ method: "GET", location: "point" })

		expect(result).toBe(true)
		expect(rpc).toHaveBeenCalledWith("move_point", {
			point_id: 5,
			latitude: 49.2,
			longitude: 20.1,
		})
		expect(dataLoads(http)).toBe(2)
	})

	it("deletes a point", async () => {
		const { fetch, rpc } = await setup()
		expect(
			await fetch({ method: "DELETE", location: "point/", pathPart: 7 })
		).toBe(true)
		expect(rpc).toHaveBeenCalledWith("delete_point", { point_id: 7 })
	})

	it("adds a ridge and returns its id", async () => {
		const { fetch, rpc } = await setup()
		rpc.mockResolvedValueOnce({ data: 42, error: null })
		const id = await fetch({
			method: "POST",
			location: "connection",
			body: { pointId1: 1, pointId2: 2, ridge: true },
		})
		expect(id).toBe(42)
		expect(rpc).toHaveBeenCalledWith("add_connection", {
			point_id1: 1,
			point_id2: 2,
		})
	})

	it("adds a route with the form data", async () => {
		const { fetch, rpc } = await setup()
		const route = { pointId1: 1, pointId2: 2, routeTime: "01:00:00" }
		const created = { routeId: 99, pointsRidge: null }
		rpc.mockResolvedValueOnce({ data: created, error: null })
		expect(
			await fetch({ method: "POST", location: "route", body: route })
		).toEqual(created)
		expect(rpc).toHaveBeenCalledWith("add_route", { route })
	})

	it("passes database errors to the notification", async () => {
		const { fetch, rpc } = await setup()
		rpc.mockResolvedValueOnce({
			data: null,
			error: { message: "Brak uprawnień" },
		})
		await expect(
			fetch({ method: "DELETE", location: "point/", pathPart: 1 })
		).rejects.toThrow("Brak uprawnień")
	})

	describe("login", () => {
		const login = {
			method: "POST",
			location: "account/login/",
			body: { email: "a@b.c", password: "x" },
		}

		it("succeeds for an admin", async () => {
			const { fetch, client } = await setup()
			client.auth.signInWithPassword.mockResolvedValue({
				data: { session: { access_token: "token" } },
				error: null,
			})
			expect(await fetch(login)).toBe(true)
		})

		it("signs out a user who is not an admin", async () => {
			const { fetch, client, rpc } = await setup()
			client.auth.signInWithPassword.mockResolvedValue({
				data: { session: { access_token: "token" } },
				error: null,
			})
			rpc.mockResolvedValueOnce({ data: false, error: null })
			await expect(fetch(login)).rejects.toThrow("Brak uprawnień")
			expect(client.auth.signOut).toHaveBeenCalled()
		})

		it("rejects wrong credentials", async () => {
			const { fetch, client } = await setup()
			client.auth.signInWithPassword.mockResolvedValue({
				data: { session: null },
				error: {
					code: "invalid_credentials",
					message: "Invalid login credentials",
				},
			})
			await expect(fetch(login)).rejects.toThrow("Niepoprawny e-mail lub hasło")
		})

		it("reports other sign-in errors as they are", async () => {
			const { fetch, client } = await setup()
			client.auth.signInWithPassword.mockResolvedValue({
				data: { session: null },
				error: {
					code: "over_request_rate_limit",
					message: "Too many requests",
				},
			})
			await expect(fetch(login)).rejects.toThrow(
				"Błąd logowania: Too many requests"
			)
		})

		it("signs out when the admin check fails", async () => {
			const { fetch, client, rpc } = await setup()
			client.auth.signInWithPassword.mockResolvedValue({
				data: { session: { access_token: "token" } },
				error: null,
			})
			rpc.mockResolvedValueOnce({ data: null, error: { message: "offline" } })
			await expect(fetch(login)).rejects.toThrow("offline")
			expect(client.auth.signOut).toHaveBeenCalled()
		})
	})

	describe("watchAdminSession", () => {
		it("reports no session on page load without loading the SDK", async () => {
			const { watch, client } = await setup()
			const onChange = vi.fn()
			await watch(onChange)
			expect(onChange.mock.calls).toEqual([[false]])
			expect(client.auth.getSession).not.toHaveBeenCalled()
		})

		it("reports an expired stored session as logged out", async () => {
			const { watch, client } = await setup()
			localStorage.setItem(sessionKey, "{}")
			client.auth.getSession.mockResolvedValue({ data: { session: null } })
			const onChange = vi.fn()
			await watch(onChange)
			expect(onChange.mock.calls).toEqual([[false]])
		})

		it("reports a session of someone who is not an admin as logged out", async () => {
			const { watch, client, rpc } = await setup()
			localStorage.setItem(sessionKey, "{}")
			client.auth.getSession.mockResolvedValue({
				data: { session: { access_token: "token" } },
			})
			rpc.mockResolvedValueOnce({ data: false, error: null })
			const onChange = vi.fn()
			await watch(onChange)
			expect(onChange.mock.calls).toEqual([[false]])
		})

		it("reports an admin session and when it ends", async () => {
			const { watch, client } = await setup()
			localStorage.setItem(sessionKey, "{}")
			client.auth.getSession.mockResolvedValue({
				data: { session: { access_token: "token" } },
			})
			const onChange = vi.fn()
			await watch(onChange)
			expect(onChange.mock.calls).toEqual([[true]])

			const listener = client.auth.onAuthStateChange.mock.calls[0][0]
			listener("TOKEN_REFRESHED")
			expect(onChange).toHaveBeenCalledTimes(1)
			listener("SIGNED_OUT")
			expect(onChange.mock.calls).toEqual([[true], [false]])
		})

		it("reports the end of a session started later on the page", async () => {
			const { watch, fetch, client } = await setup()
			const onChange = vi.fn()
			await watch(onChange)
			client.auth.signInWithPassword.mockResolvedValue({
				data: { session: { access_token: "token" } },
				error: null,
			})
			await fetch({
				method: "POST",
				location: "account/login/",
				body: { email: "a@b.c", password: "x" },
			})
			const listener = client.auth.onAuthStateChange.mock.calls[0][0]
			listener("SIGNED_OUT")
			expect(onChange.mock.calls).toEqual([[false], [false]])
		})
	})
})
