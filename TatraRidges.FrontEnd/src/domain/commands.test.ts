import { data } from "./__fixtures__/scenarioData"
import { addConnection, addRoute, deletePoint, movePoint } from "./commands"
import {
	CyclicRidgeError,
	InvalidCoordinateError,
	NotFoundError,
} from "./errors"
import { AddRouteInput } from "./types"

describe("movePoint", () => {
	it("changes the coordinates of one point", () => {
		const points = movePoint(data.points, 2, {
			latitude: 49.25,
			longitude: 20.1,
		})
		expect(points.find(p => p.id === 2)).toMatchObject({
			lat: 49.25,
			lng: 20.1,
		})
		expect(points.find(p => p.id === 1)).toBe(data.points[0])
	})

	it("rejects coordinates outside the Tatras", () => {
		expect(() =>
			movePoint(data.points, 2, { latitude: 50, longitude: 20.1 })
		).toThrow(
			new InvalidCoordinateError(
				"Szerokość geograficzna musi być z zakresu <49.12; 49.29>."
			)
		)
	})

	it("fails for a missing point", () => {
		expect(() =>
			movePoint(data.points, 99, { latitude: 49.2, longitude: 20 })
		).toThrow(NotFoundError)
	})
})

describe("deletePoint", () => {
	it("removes the point and every ridge that touches it", () => {
		const result = deletePoint(data, 3)
		expect(result.points.map(p => p.id)).not.toContain(3)
		expect(result.ridges.map(r => r.id)).toEqual([1, 4, 5, 7, 8, 9, 10])
	})

	it("fails for a missing point", () => {
		expect(() => deletePoint(data, 99)).toThrow(
			new NotFoundError("Nie ma punktu z Id = 99")
		)
	})
})

describe("addConnection", () => {
	it("adds a ridge with the next id", () => {
		const { ridges, ridge } = addConnection(data, 6, 10)
		expect(ridge).toEqual({ id: 11, pointId1: 6, pointId2: 10, routes: [] })
		expect(ridges).toHaveLength(data.ridges.length + 1)
	})

	it("refuses a ridge that would close a loop", () => {
		expect(() => addConnection(data, 1, 6)).toThrow(CyclicRidgeError)
	})

	it("fails for a missing point", () => {
		expect(() => addConnection(data, 1, 99)).toThrow(NotFoundError)
	})
})

describe("addRoute", () => {
	const input = (changes: Partial<AddRouteInput> = {}): AddRouteInput => ({
		pointId1: 2,
		pointId2: 1,
		difficultyValue: 3,
		difficultySign: "-",
		rappeling: true,
		routeType: 2,
		guideDescription: { guideId: 2, page: 15, volume: 1, number: "8 A" },
		routeTime: "01:30:00",
		adjectives: ["ce", "be", "_k", "_p"],
		additionalDescriptions: [{ description: "Luźne bloki", warning: true }],
		...changes,
	})

	it("adds the route to the existing ridge between the points", () => {
		const { ridges, result } = addRoute(data, input())

		expect(result).toEqual({ routeId: 14, pointsRidge: null })
		expect(ridges.find(r => r.id === 1)!.routes.at(-1)).toEqual({
			id: 14,
			consistentDirection: false,
			difficultyId: 3,
			difficultyDetailId: 2,
			rappeling: true,
			routeTypeId: 2,
			routeTimeMin: 90,
			guideId: 2,
			guideNumber: "8 A",
			guidePage: 15,
			guideVolume: 1,
			// One adjective per group (the highest rank), ordered by group.
			adjectiveIds: ["be", "_k", "_p"],
			additional: [{ description: "Luźne bloki", warning: true }],
		})
	})

	it("creates a new ridge when the points are not connected yet", () => {
		const { ridges, result } = addRoute(
			data,
			input({ pointId1: 6, pointId2: 10 })
		)

		expect(result).toEqual({
			routeId: 14,
			pointsRidge: {
				id: 11,
				pointId1: 6,
				pointId2: 10,
				pointFrom: { latitude: 49.205, longitude: 20.05 },
				pointTo: { latitude: 49.25, longitude: 20.2 },
			},
		})
		expect(ridges.find(r => r.id === 11)!.routes[0].consistentDirection).toBe(
			true
		)
	})

	it("refuses a new ridge that would close a loop", () => {
		expect(() => addRoute(data, input({ pointId1: 1, pointId2: 6 }))).toThrow(
			CyclicRidgeError
		)
	})

	it("fails for an unknown difficulty sign", () => {
		expect(() => addRoute(data, input({ difficultySign: "?" }))).toThrow(
			NotFoundError
		)
	})

	it("does not change the input data", () => {
		const before = JSON.stringify(data.ridges)
		addRoute(data, input())
		expect(JSON.stringify(data.ridges)).toBe(before)
	})
})
