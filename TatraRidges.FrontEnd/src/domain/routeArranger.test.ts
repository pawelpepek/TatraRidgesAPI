import { data } from "./__fixtures__/scenarioData"
import { arrangeRoutes } from "./routeArranger"
import { PointsConnectionWithDirection, RidgeData, RouteData } from "./types"

// Ported from RouteArrangerTests.cs.

let nextId = 0

const route = (changes: Partial<RouteData> = {}): RouteData => ({
	id: nextId++,
	consistentDirection: false,
	difficultyId: 0,
	difficultyDetailId: 0,
	rappeling: false,
	routeTypeId: 2,
	routeTimeMin: 0,
	guideId: 1,
	guideNumber: "1",
	guidePage: 1,
	guideVolume: 1,
	adjectiveIds: [],
	additional: [],
	...changes,
})

// Every ridge has two routes that differ in one sorting key.
const routes: RouteData[][] = [
	[route(), route({ consistentDirection: true })],
	[route({ routeTypeId: 1 }), route()],
	[route({ adjectiveIds: ["_e"] }), route()],
	// In C# both routes had detail id 0, so the "-" and "+" signs did not change the value.
	[
		route({ difficultyId: 3, difficultyDetailId: 2 }),
		route({ difficultyId: 3, difficultyDetailId: 1 }),
	],
	[route(), route({ rappeling: true })],
	[route({ routeTimeMin: 61 }), route()],
]

const ridges: RidgeData[] = [
	{ id: 1, pointId1: 1, pointId2: 2, routes: routes[0] },
	{ id: 2, pointId1: 3, pointId2: 2, routes: routes[1] },
	{ id: 3, pointId1: 3, pointId2: 4, routes: routes[2] },
	{ id: 4, pointId1: 5, pointId2: 4, routes: routes[3] },
	{ id: 5, pointId1: 5, pointId2: 6, routes: routes[4] },
	{ id: 6, pointId1: 7, pointId2: 6, routes: routes[5] },
]

describe("arrangeRoutes", () => {
	const ridgeRoute: PointsConnectionWithDirection[] = ridges.map(
		(ridge, i) => ({
			ridge,
			consistDirection: i % 2 === 0,
		})
	)

	const result = arrangeRoutes(ridgeRoute, data.params)

	it("orients every section in walking order", () => {
		expect(
			result.map(r => [r.pointsConnectionId, r.pointId1, r.pointId2])
		).toEqual(ridges.map((r, i) => [i + 1, i + 1, i + 2]))
	})

	it.each([
		["direction consistent with walking first", 0, [1, 0]],
		["lower route type rank first", 1, [1, 0]],
		["higher adjective rank first", 2, [0, 1]],
		["harder route first", 3, [1, 0]],
		["route without rappeling first", 4, [0, 1]],
		["shorter route first", 5, [1, 0]],
	] as [string, number, number[]][])("sorts by %s", (_, index, order) => {
		expect(result[index].routes.map(r => r.id)).toEqual(
			order.map(i => routes[index][i].id)
		)
	})
})
