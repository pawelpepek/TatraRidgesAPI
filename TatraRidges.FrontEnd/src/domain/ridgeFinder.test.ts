import { findRidge } from "./ridgeFinder"
import { RidgeData } from "./types"

const ridge = (id: number, pointId1: number, pointId2: number): RidgeData => ({
	id,
	pointId1,
	pointId2,
	routes: [],
})

//  1 — 2 — 3 — 4      6 — 7
//          |
//          5
const ridges = [
	ridge(1, 1, 2),
	ridge(2, 3, 2),
	ridge(3, 3, 4),
	ridge(4, 5, 3),
	ridge(5, 6, 7),
]

const path = (from: number, to: number) =>
	findRidge(ridges, from, to).map(p => [p.ridge.id, p.consistDirection])

describe("findRidge", () => {
	it("walks the ridges between two points and drops side branches", () => {
		expect(path(1, 4)).toEqual([
			[1, true],
			[2, false],
			[3, true],
		])
	})

	it("reverses the directions when walking back", () => {
		expect(path(4, 1)).toEqual([
			[3, false],
			[2, true],
			[1, false],
		])
	})

	it("follows a side branch when it is the target", () => {
		expect(path(1, 5)).toEqual([
			[1, true],
			[2, false],
			[4, false],
		])
	})

	it("returns nothing for points that are not connected", () => {
		expect(path(1, 7)).toEqual([])
	})

	it("returns nothing for the same point", () => {
		expect(path(3, 3)).toEqual([])
	})

	it("finds a path between two points about to be joined, which would close a loop", () => {
		expect(path(4, 5)).toEqual([
			[3, false],
			[4, false],
		])
	})
})
