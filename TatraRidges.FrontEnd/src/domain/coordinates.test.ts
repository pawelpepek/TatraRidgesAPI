import {
	coordinatesErrorMessage,
	DecimalRange,
	isCoordinatesValid,
} from "./coordinates"

// Ported from DecimalRangeTests.cs and MountainPointValidatorTests.cs.

describe("DecimalRange.isNumberInThisRange", () => {
	it.each([
		[0, -10, 13],
		[0.1, 0, 0.1],
		[13, 12, 13],
		[-13, -13, -13],
		[1, 1, 2],
		[0, -100, 100],
	])("%f is in <%f; %f>", (value, min, max) => {
		expect(new DecimalRange(min, max).isNumberInThisRange(value)).toBe(true)
	})

	it.each([
		[14, -10, 13],
		[-0.1, 0, 0.1],
		[0, 12, 13],
		[13, -13, -13],
		[1, 2, 1],
		[0, 100, -100],
	])("%f is not in <%f; %f>", (value, min, max) => {
		expect(new DecimalRange(min, max).isNumberInThisRange(value)).toBe(false)
	})
})

const correctCoordinates = [
	{ latitude: 49.12, longitude: 19.91 },
	{ latitude: 49.21, longitude: 19.91 },
	{ latitude: 49.29, longitude: 19.91 },
	{ latitude: 49.12, longitude: 20.29 },
	{ latitude: 49.13, longitude: 20.29 },
	{ latitude: 49.29, longitude: 20.29 },
	{ latitude: 49.2, longitude: 20 },
]

const invalidCoordinates = [
	{ latitude: 49.1, longitude: 19.91 },
	{ latitude: -49.21, longitude: 19.91 },
	{ latitude: -49.29, longitude: -19.91 },
	{ latitude: 49.12, longitude: -20.29 },
	{ latitude: 49.13, longitude: 20.29001 },
	{ latitude: 49.29, longitude: 20.29001 },
	{ latitude: 49.119999, longitude: 20 },
]

describe("coordinates validation", () => {
	it.each(correctCoordinates)("accepts %o", coordinates => {
		expect(isCoordinatesValid(coordinates)).toBe(true)
		expect(coordinatesErrorMessage(coordinates)).toBe("")
	})

	it.each(invalidCoordinates)("rejects %o", coordinates => {
		expect(isCoordinatesValid(coordinates)).toBe(false)
		expect(coordinatesErrorMessage(coordinates)).not.toBe("")
	})

	it("names every coordinate out of range", () => {
		expect(coordinatesErrorMessage({ latitude: 50, longitude: 21 })).toBe(
			"Szerokość geograficzna musi być z zakresu <49.12; 49.29>.\n" +
				"Długość geograficzna musi być z zakresu <19.91; 20.29>."
		)
	})
})
