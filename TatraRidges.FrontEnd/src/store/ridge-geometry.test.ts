import { describe, expect, it } from "vitest"
import {
	bypassProfile,
	orientedGeometry,
	RidgeGeometry,
	roundCorners,
	routeTypeProfile,
} from "./ridge-geometry"

const geometry: RidgeGeometry = {
	id: 1,
	line: [
		[49.2, 20.0],
		[49.201, 20.001],
		[49.2, 20.002],
	],
	profile: [2000, 2010, 2005],
}
const a = { latitude: 49.2, longitude: 20.0 }
const b = { latitude: 49.2, longitude: 20.002 }

describe("roundCorners", () => {
	it("keeps the ends and adds vertices", () => {
		const rounded = roundCorners(geometry.line, 2)
		expect(rounded[0]).toEqual(geometry.line[0])
		expect(rounded[rounded.length - 1]).toEqual(geometry.line[2])
		expect(rounded.length).toBeGreaterThan(geometry.line.length)
	})

	it("cuts the corner", () => {
		const peak = Math.max(...roundCorners(geometry.line, 1).map(([lat]) => lat))
		expect(peak).toBeLessThan(49.201)
	})

	it("leaves a straight line as it is", () => {
		expect(roundCorners([geometry.line[0], geometry.line[2]])).toEqual([
			geometry.line[0],
			geometry.line[2],
		])
	})
})

describe("orientedGeometry", () => {
	it("keeps the direction from PointId1", () => {
		expect(orientedGeometry(geometry, a, b)?.profile).toEqual([
			2000, 2010, 2005,
		])
	})

	it("reverses the line and the profile in the other direction", () => {
		const reversed = orientedGeometry(geometry, b, a)
		expect(reversed?.profile).toEqual([2005, 2010, 2000])
		expect(reversed?.line[0]).toEqual(geometry.line[2])
	})

	it("is undefined when a point was moved", () => {
		expect(
			orientedGeometry(geometry, { latitude: 49.2001, longitude: 20.0 }, b)
		).toBeUndefined()
	})

	it("is undefined without geometry", () => {
		expect(orientedGeometry(undefined, a, b)).toBeUndefined()
	})
})

describe("bypassProfile", () => {
	// A flat ridge at 2000 m with a 10 m wide tower 30 m high and a notch of the same size
	const ridge = Array.from({ length: 100 }, (_, i) =>
		i >= 30 && i < 35 ? 2030 : i >= 60 && i < 65 ? 1970 : 2000
	)

	it("cuts towers narrower than the width", () => {
		const bypass = bypassProfile(ridge, 24)
		expect(Math.max(...bypass.slice(25, 40))).toBeLessThan(2005)
	})

	it("keeps notches", () => {
		const bypass = bypassProfile(ridge, 24)
		expect(Math.min(...bypass.slice(55, 70))).toBeLessThan(1980)
	})

	it("keeps towers wider than the width", () => {
		const wide = Array.from({ length: 100 }, (_, i) =>
			i >= 30 && i < 60 ? 2030 : 2000
		)
		expect(Math.max(...bypassProfile(wide, 24))).toBe(2030)
	})

	it("ends on the points' heights", () => {
		const rising = Array.from(
			{ length: 50 },
			(_, i) => 2000 + i * (i % 2 ? 3 : 1)
		)
		const bypass = bypassProfile(rising, 120)
		expect(bypass[0]).toBe(rising[0])
		expect(bypass[49]).toBe(rising[49])
	})
})

describe("routeTypeProfile", () => {
	it("keeps the profile of a route strictly on the ridge", () => {
		expect(routeTypeProfile(geometry.profile, 1)).toBe(geometry.profile)
	})

	it("cuts more for a bypass than for a route nearly on the ridge", () => {
		const ridge = Array.from({ length: 200 }, (_, i) =>
			i >= 80 && i < 100 ? 2040 : 2000
		)
		expect(Math.max(...routeTypeProfile(ridge, 3))).toBeLessThan(
			Math.max(...routeTypeProfile(ridge, 2))
		)
	})
})
