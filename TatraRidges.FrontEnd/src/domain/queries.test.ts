import { data } from "./__fixtures__/scenarioData"
import { NotFoundError } from "./errors"
import {
	getMountainPoints,
	getParameters,
	getRidges,
	getRouteSummary,
} from "./queries"

describe("getMountainPoints", () => {
	it("maps points to the API shape", () => {
		expect(getMountainPoints(data.points)[3]).toEqual({
			id: 4,
			pointTypeId: 2,
			name: "P4",
			evaluation: null,
			latitude: 49.203,
			longitude: 20.03,
		})
	})
})

describe("getRidges", () => {
	it("adds the coordinates of both ends", () => {
		expect(getRidges(data)[1]).toEqual({
			id: 2,
			pointId1: 3,
			pointId2: 2,
			pointFrom: { latitude: 49.202, longitude: 20.02 },
			pointTo: { latitude: 49.201, longitude: 20.01 },
		})
	})

	it("fails for a ridge to a missing point", () => {
		const broken = {
			...data,
			ridges: [{ id: 1, pointId1: 1, pointId2: 99, routes: [] }],
		}
		expect(() => getRidges(broken)).toThrow(
			new NotFoundError("Nie ma punktu z Id = 99")
		)
	})
})

describe("getParameters", () => {
	const parameters = getParameters(data.params)

	it("lists adjectives, guides and route types", () => {
		expect(parameters.adjectives[0]).toEqual({ id: "_c", text: "Ciekawa" })
		expect(parameters.adjectives).toHaveLength(19)
		expect(parameters.guides.map(g => g.shortName)).toEqual(["WHP", "WC"])
		expect(parameters.routeTypes[2]).toEqual({
			id: 3,
			name: "Obchodząc grań",
			rank: 3,
		})
	})

	it("lists grades with + and - only for 0 and above II", () => {
		expect(parameters.difficulties.slice(0, 7).map(d => d.text)).toEqual([
			"0-",
			"0",
			"0+",
			"I",
			"II",
			"III-",
			"III",
		])
	})
})

describe("getRouteSummary", () => {
	// Kept from the C# RoutesConverter: route 11 is stored from point 8 to 7
	// (consistentDirection = false), and walking it from point 8 is still reported
	// as the opposite direction. getRouteBetweenPoints(8, 7) reports it as consistent.
	it("reports the direction of routes stored backwards like the C# code", () => {
		const summary = getRouteSummary(data, [{ routeId: 11, pointFrom: 8 }])
		expect(summary.isConsistentDirection).toBe(false)
	})
})
