import { formatTimeSpan, parseTimeSpan } from "./time"

describe("formatTimeSpan", () => {
	it.each([
		[0, "00:00:00"],
		[5, "00:05:00"],
		[125, "02:05:00"],
		[1439, "23:59:00"],
		[1440, "1.00:00:00"],
		[1490, "1.00:50:00"],
	])("formats %i minutes as %s", (minutes, text) => {
		expect(formatTimeSpan(minutes)).toBe(text)
	})
})

describe("parseTimeSpan", () => {
	it.each([
		["00:00", 0],
		["02:05", 125],
		["02:05:00", 125],
		["1.00:50:00", 1490],
	])("parses %s as %i minutes", (text, minutes) => {
		expect(parseTimeSpan(text)).toBe(minutes)
	})

	it("rejects text that is not a time", () => {
		expect(() => parseTimeSpan("abc")).toThrow("Niepoprawny czas: abc")
	})
})
