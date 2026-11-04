import { data, scenario } from "./__fixtures__/scenarioData"
import { NotFoundError } from "./errors"
import {
	getMountainPoints,
	getParameters,
	getRidges,
	getRouteBetweenPoints,
	getRouteSummary,
} from "./queries"

describe("getMountainPoints", () => {
	it("maps points to the API shape", () => {
		expect(getMountainPoints(data.points)[3]).toEqual({
			id: 4,
			pointTypeId: 2,
			name: "P4",
			alternativeName: null,
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
	// Route 11 is stored from point 8 to 7 (consistentDirection = false). The C#
	// RoutesConverter reported walking it from point 8 as the opposite direction.
	it.each([
		[8, true],
		[7, false],
	])(
		"reports a route stored backwards walked from point %i as consistent: %s",
		(pointFrom, consistent) => {
			const summary = getRouteSummary(data, [{ routeId: 11, pointFrom }])
			expect(summary.isConsistentDirection).toBe(consistent)
		}
	)

	describe.each(scenario.ridgeQueries)(
		"agrees with getRouteBetweenPoints(%i, %i)",
		(from, to) => {
			const { ridgesContainer, initalRouteSummary } = getRouteBetweenPoints(
				data,
				from,
				to
			)

			it("for the direction of every route", () => {
				ridgesContainer.forEach(section =>
					section.routes.forEach(route => {
						const summary = getRouteSummary(data, [
							{ routeId: route.id, pointFrom: section.pointId1 },
						])
						expect(summary.isConsistentDirection).toBe(
							route.consistentDirection
						)
					})
				)
			})

			const complete = ridgesContainer.every(s => s.routes.length > 0)

			;(complete ? it : it.skip)("for the initial summary", () => {
				const routesIdFrom = ridgesContainer.map(s => ({
					routeId: s.routes[0].id,
					pointFrom: s.pointId1,
				}))
				expect(getRouteSummary(data, routesIdFrom)).toEqual(initalRouteSummary)
			})
		}
	)
})
