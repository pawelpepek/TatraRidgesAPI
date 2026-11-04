import { describe, expect, it } from "vitest"
import { MountainPoint } from "../components/types"
import { RidgeGeometry } from "./ridge-geometry"
import { routeProfile } from "./route-profile"
import { Route, RidgeWithRoutes } from "./routeTypes"

const point = (
	id: number,
	longitude: number,
	evaluation: number
): MountainPoint => ({
	id,
	name: `P${id}`,
	latitude: 49.2,
	longitude,
	pointTypeId: 1,
	evaluation,
})
const p1 = point(1, 20.0, 2000)
const p2 = point(2, 20.001, 2010)
const p3 = point(3, 20.002, 1990)

const route = (id: number, routeTypeId: number) =>
	({ id, routeType: { id: routeTypeId } }) as Route

const part = (
	from: MountainPoint,
	to: MountainPoint,
	connectionId: number,
	routes: Route[]
) =>
	({
		pointId1: from.id,
		pointId2: to.id,
		point1: from,
		point2: to,
		pointsConnectionId: connectionId,
		routes,
		selectedId: routes[0].id,
	}) as RidgeWithRoutes

// Connection 10 is stored from p2 to p1, so the route goes against its direction
const geometry: Record<number, RidgeGeometry> = {
	10: {
		id: 10,
		line: [
			[49.2, 20.001],
			[49.2, 20.0],
		],
		profile: [2010, 2004, 2001, 2000],
	},
}

describe("routeProfile", () => {
	it("uses the laser profile in the route's direction", () => {
		const profile = routeProfile([part(p1, p2, 10, [route(1, 1)])], geometry)
		expect(profile.samples.map(s => s.height)).toEqual([2000, 2001, 2004, 2010])
		expect(profile.samples.map(s => s.distance)).toEqual([0, 2, 4, 6])
		expect(profile.measured).toBe(1)
	})

	it("draws a straight line between the points' heights without a profile", () => {
		const profile = routeProfile([part(p2, p3, 11, [route(2, 1)])], geometry)
		expect(profile.samples.map(s => s.height)).toEqual([2010, 1990])
		expect(profile.length).toBeCloseTo(72.7, 0)
		expect(profile.measured).toBe(0)
	})

	it("joins the sections and marks the points", () => {
		const profile = routeProfile(
			[part(p1, p2, 10, [route(1, 1)]), part(p2, p3, 11, [route(2, 1)])],
			geometry
		)
		expect(profile.samples).toHaveLength(5)
		expect(profile.points.map(p => [p.name, p.distance])).toEqual([
			["P1", 0],
			["P2", 6],
			["P3", profile.length],
		])
	})

	it("follows the selected variant's route type", () => {
		const bumpy: Record<number, RidgeGeometry> = {
			12: {
				id: 12,
				line: [
					[49.2, 20.0],
					[49.2, 20.001],
				],
				profile: Array.from({ length: 100 }, (_, i) =>
					i >= 40 && i < 45 ? 2030 : 2000
				),
			},
		}
		const strict = routeProfile([part(p1, p2, 12, [route(1, 1)])], bumpy)
		const around = routeProfile([part(p1, p2, 12, [route(1, 3)])], bumpy)
		expect(Math.max(...strict.samples.map(s => s.height))).toBe(2030)
		expect(Math.max(...around.samples.map(s => s.height))).toBeLessThan(2005)
	})
})
