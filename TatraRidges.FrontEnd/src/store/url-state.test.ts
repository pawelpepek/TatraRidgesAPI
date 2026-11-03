import { RidgeWithRoutes, Route } from "./routeTypes"
import {
	formatUrlState,
	parseUrlState,
	pickRoutes,
	selectedRoutes,
} from "./url-state"

const ridge = (connectionId: number, routeIds: number[]): RidgeWithRoutes => ({
	pointId1: connectionId,
	pointId2: connectionId + 1,
	pointsConnectionId: connectionId,
	routes: routeIds.map(id => ({ id }) as Route),
	selectedId: routeIds.length > 0 ? routeIds[0] : -1,
})

describe("parseUrlState", () => {
	it("reads the map view, points, routes and map version", () => {
		expect(
			parseUrlState("?m=49.17931,20.08844,14&from=123&to=456&r=1001.1002&l=1")
		).toEqual({
			center: {
				coordinates: { latitude: 49.17931, longitude: 20.08844 },
				zoom: 14,
			},
			from: 123,
			to: 456,
			routes: [1001, 1002],
			mapVersion: 1,
		})
	})

	it("returns nothing for an empty address", () => {
		expect(parseUrlState("")).toEqual({})
	})

	it("accepts encoded commas", () => {
		expect(parseUrlState("?m=49.1%2C20.1%2C12").center).toEqual({
			coordinates: { latitude: 49.1, longitude: 20.1 },
			zoom: 12,
		})
	})

	it.each([
		"49.1,20.1",
		"49.1,20.1,12.5",
		"91,20,12",
		"49,181,12",
		"49,20,18",
		"a,b,c",
		",20,12",
	])("ignores an invalid map view %s", m => {
		expect(parseUrlState(`?m=${m}`).center).toBeUndefined()
	})

	it("ignores invalid ids and map versions", () => {
		expect(parseUrlState("?from=-1&to=1.5&l=2")).toEqual({})
		expect(parseUrlState("?from=abc&to=0")).toEqual({})
	})

	it("keeps the valid route ids and an empty route list", () => {
		expect(parseUrlState("?r=1.x.-3.4").routes).toEqual([1, 4])
		expect(parseUrlState("?r=").routes).toEqual([])
	})
})

describe("formatUrlState", () => {
	it("writes what parseUrlState reads", () => {
		const state = {
			center: {
				coordinates: { latitude: 49.17931, longitude: 20.08844 },
				zoom: 14,
			},
			from: 123,
			to: 456,
			routes: [1001, 1002],
			mapVersion: 1,
		}
		const search = formatUrlState(state)
		expect(search).toBe(
			"?m=49.17931,20.08844,14&from=123&to=456&r=1001.1002&l=1"
		)
		expect(parseUrlState(search)).toEqual(state)
	})

	it("rounds coordinates to five decimals and drops trailing zeros", () => {
		expect(
			formatUrlState({
				center: {
					coordinates: { latitude: 49.179306123, longitude: 20.1 },
					zoom: 13,
				},
			})
		).toBe("?m=49.17931,20.1,13")
	})

	it("leaves out the default map version and missing values", () => {
		expect(formatUrlState({ mapVersion: 0, to: 5 })).toBe("?to=5")
		expect(formatUrlState({})).toBe("")
	})
})

describe("pickRoutes", () => {
	const ridges = [ridge(1, [11, 12]), ridge(2, [21, 22, 23]), ridge(3, [])]

	it("selects the variants named in the address in any order", () => {
		expect(pickRoutes(ridges, [23, 12])).toEqual([12, 23, -1])
	})

	it("keeps the default for sections without a known variant", () => {
		expect(pickRoutes(ridges, [99, 22])).toEqual([11, 22, -1])
		expect(pickRoutes(ridges, [])).toEqual([11, 21, -1])
	})

	it("ignores variants of other sections", () => {
		expect(pickRoutes([ridge(1, [11, 12])], [21])).toEqual([11])
	})
})

describe("selectedRoutes", () => {
	it("lists the selected variants of sections that have one", () => {
		expect(selectedRoutes([ridge(1, [11, 12]), ridge(3, [])])).toEqual([11])
	})
})
