import { data } from "../domain/__fixtures__/scenarioData"

jest.mock("../supabase", () => {
	const supabase = {
		rpc: jest.fn(),
		auth: { signInWithPassword: jest.fn(), signOut: jest.fn() },
	}
	return { supabase, getSupabase: () => supabase }
})

// A fresh module per test: supabase-data keeps the loaded data in a module variable.
const setup = () => {
	let module: typeof import("./supabase-data") | undefined
	let client: any
	jest.isolateModules(() => {
		module = require("./supabase-data")
		client = require("../supabase").supabase
	})
	const rpc = client.rpc as jest.Mock
	rpc.mockImplementation(async (fn: string) =>
		fn === "get_tatra_data"
			? { data, error: null }
			: fn === "is_admin"
				? { data: true, error: null }
				: { data: null, error: null }
	)
	return { fetch: module!.fetchFromSupabase, client, rpc }
}

const dataLoads = (rpc: jest.Mock) =>
	rpc.mock.calls.filter(([fn]) => fn === "get_tatra_data").length

describe("fetchFromSupabase", () => {
	it("answers reads from one get_tatra_data call", async () => {
		const { fetch, rpc } = setup()
		const points = await fetch({ method: "GET", location: "point" })
		await fetch({ method: "GET", location: "connection" })
		expect(points).toHaveLength(data.points.length)
		expect(dataLoads(rpc)).toBe(1)
	})

	it("moves a point and reloads the data afterwards", async () => {
		const { fetch, rpc } = setup()
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
		expect(dataLoads(rpc)).toBe(2)
	})

	it("deletes a point", async () => {
		const { fetch, rpc } = setup()
		expect(
			await fetch({ method: "DELETE", location: "point/", pathPart: 7 })
		).toBe(true)
		expect(rpc).toHaveBeenCalledWith("delete_point", { point_id: 7 })
	})

	it("adds a ridge and returns its id", async () => {
		const { fetch, rpc } = setup()
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
		const { fetch, rpc } = setup()
		const route = { pointId1: 1, pointId2: 2, routeTime: "01:00:00" }
		const created = { routeId: 99, pointsRidge: null }
		rpc.mockResolvedValueOnce({ data: created, error: null })
		expect(
			await fetch({ method: "POST", location: "route", body: route })
		).toEqual(created)
		expect(rpc).toHaveBeenCalledWith("add_route", { route })
	})

	it("passes database errors to the notification", async () => {
		const { fetch, rpc } = setup()
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

		it("returns the access token of an admin", async () => {
			const { fetch, client } = setup()
			client.auth.signInWithPassword.mockResolvedValue({
				data: { session: { access_token: "token" } },
				error: null,
			})
			expect(await fetch(login)).toBe("token")
		})

		it("signs out a user who is not an admin", async () => {
			const { fetch, client, rpc } = setup()
			client.auth.signInWithPassword.mockResolvedValue({
				data: { session: { access_token: "token" } },
				error: null,
			})
			rpc.mockResolvedValueOnce({ data: false, error: null })
			await expect(fetch(login)).rejects.toThrow("Brak uprawnień")
			expect(client.auth.signOut).toHaveBeenCalled()
		})

		it("rejects wrong credentials", async () => {
			const { fetch, client } = setup()
			client.auth.signInWithPassword.mockResolvedValue({
				data: { session: null },
				error: { message: "Invalid login credentials" },
			})
			await expect(fetch(login)).rejects.toThrow("Niepoprawny e-mail lub hasło")
		})
	})
})
