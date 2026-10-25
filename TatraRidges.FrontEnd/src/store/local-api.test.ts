import { data } from "../domain/__fixtures__/scenarioData"
import { getRouteBetweenPoints } from "../domain"
import { handleRequest } from "./local-api"

describe("handleRequest", () => {
	it("returns points", () => {
		const points = handleRequest({ method: "GET", location: "point" }, data)
		expect(points).toHaveLength(data.points.length)
	})

	it("returns ridges with coordinates", () => {
		const ridges = handleRequest(
			{ method: "GET", location: "connection" },
			data
		)
		expect(ridges).toHaveLength(data.ridges.length)
	})

	it("finds the route from the query string used by getRidge", () => {
		const info = handleRequest(
			{ method: "GET", location: "route", pathPart: "?from=1&to=6" },
			data
		)
		expect(info).toEqual(getRouteBetweenPoints(data, 1, 6))
	})

	it("answers like the API's 404 when the points are not connected", () => {
		expect(() =>
			handleRequest(
				{ method: "GET", location: "route", pathPart: "?from=1&to=11" },
				data
			)
		).toThrow("Brak wyników")
	})

	it("summarises chosen routes", () => {
		const summary = handleRequest(
			{
				method: "POST",
				location: "route/parts",
				body: [{ routeId: 1, pointFrom: 1 }],
			},
			data
		)
		expect(summary).toMatchObject({ routeTime: "00:30:00", rank: 10 })
	})

	it("returns route form parameters", () => {
		const parameters = handleRequest(
			{ method: "GET", location: "route/parameters" },
			data
		)
		expect(parameters).toHaveProperty("guides")
	})

	it.each([
		["PUT", "point/"],
		["DELETE", "point/"],
		["POST", "connection"],
		["POST", "route"],
		["POST", "account/login/"],
	])("refuses %s %s, which is not available yet", (method, location) => {
		expect(() => handleRequest({ method, location }, data)).toThrow(
			"nie jest jeszcze dostępna w trybie Firebase"
		)
	})
})
