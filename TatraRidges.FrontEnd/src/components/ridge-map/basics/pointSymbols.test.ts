import { ConnectionPoints, MountainPoint } from "../../types"
import { pointIcon, ridgeAngles } from "./pointSymbols"

const point = (id: number, latitude: number, longitude: number) =>
	({ id, latitude, longitude, name: `${id}`, pointTypeId: 2 }) as MountainPoint

const connection = (
	id: number,
	point1: MountainPoint,
	point2: MountainPoint
): ConnectionPoints => ({ id, point1, point2 })

describe("ridgeAngles", () => {
	const pass = point(1, 0, 0)

	test("a ridge running east-west through a pass is horizontal", () => {
		const angles = ridgeAngles([
			connection(1, pass, point(2, 0, 1)),
			connection(2, point(3, 0, -1), pass),
		])

		expect(angles.get(1)).toBe(0)
		expect(angles.get(2)).toBe(0)
		expect(angles.get(3)).toBe(0)
	})

	test("a ridge running north-south is vertical", () => {
		const angles = ridgeAngles([
			connection(1, pass, point(2, 1, 0)),
			connection(2, pass, point(3, -1, 0)),
		])

		expect(Math.abs(angles.get(1)!)).toBe(90)
	})

	test("a ridge from north-west to south-east goes down to the right on screen", () => {
		const angles = ridgeAngles([
			connection(1, pass, point(2, 1, -1)),
			connection(2, pass, point(3, -1, 1)),
		])

		expect(angles.get(1)).toBe(45)
	})

	test("a bent ridge takes the direction between its two sides", () => {
		// east and north: the pass sits in the corner, its ridge runs north-east
		const angles = ridgeAngles([
			connection(1, pass, point(2, 0, 1)),
			connection(2, pass, point(3, 1, 0)),
		])

		expect(angles.get(1)).toBe(-45)
	})

	test("longitude is shortened by the latitude", () => {
		// at 60° a degree of longitude is half a degree of latitude long
		const north = point(10, 60, 20)
		const angles = ridgeAngles([connection(1, north, point(11, 61, 22))])

		expect(angles.get(10)).toBe(-45)
	})
})

describe("pointIcon", () => {
	const html = (pointTypeId: number, angle: number) =>
		pointIcon(pointTypeId, angle).options.html as string

	test("only a pass is rotated", () => {
		expect(html(2, 30)).toContain("rotate(30deg)")
		expect(html(1, 30)).toContain("rotate(0deg)")
		expect(html(3, 30)).toContain("rotate(0deg)")
	})
})
