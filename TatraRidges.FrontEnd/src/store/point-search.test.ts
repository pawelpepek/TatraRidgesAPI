import { MountainPoint } from "../components/types"
import { normalizeSearchText, searchPoints } from "./point-search"

const point = (
	id: number,
	name: string,
	alternativeName: string | null = null,
	evaluation = 2000
): MountainPoint => ({
	id,
	name,
	alternativeName,
	evaluation,
	pointTypeId: 1,
	latitude: 49.2,
	longitude: 20,
})

const points = [
	point(1, "Świnica", "Svinica", 2301),
	point(2, "Zawrat", null, 2159),
	point(3, "Mała Koszysta"),
	point(4, "Przełęcz pod Świnicą"),
	point(5, "Łomnica", "Lomnický štít", 2634),
	point(6, "Koszysta Wielka"),
	point(7, "Gerlach", "Gerlachovský štít", 2655),
]

const names = (text: string) => searchPoints(points, text).map(m => m.point.name)

describe("normalizeSearchText", () => {
	it("drops case and diacritics, keeping the length", () => {
		const text = "Łomnický ŠTÍT Żółć"
		expect(normalizeSearchText(text)).toBe("lomnicky stit zolc")
		expect(normalizeSearchText(text)).toHaveLength(text.length)
	})
})

describe("searchPoints", () => {
	it("finds nothing for an empty query", () => {
		expect(searchPoints(points, "  ")).toEqual([])
	})

	it("ignores case and Polish and Slovak letters", () => {
		expect(names("swinica")).toEqual(["Świnica", "Przełęcz pod Świnicą"])
		expect(names("ŁOM")).toEqual(["Łomnica"])
	})

	it("puts the start of the name before a word inside it", () => {
		expect(names("kosz")).toEqual(["Koszysta Wielka", "Mała Koszysta"])
	})

	it("finds a point by its alternative name after names", () => {
		expect(names("lomnicky")).toEqual(["Łomnica"])
		expect(names("svin")).toEqual(["Świnica"])
		expect(names("gerlach")).toEqual(["Gerlach"])
	})

	it("matches every word of the query in any order", () => {
		expect(names("wielka kosz")).toEqual(["Koszysta Wielka"])
		expect(names("pod przel")).toEqual(["Przełęcz pod Świnicą"])
	})

	it("matches text inside a word last", () => {
		expect(names("wrat")).toEqual(["Zawrat"])
	})

	it("marks the matched part of the name or the alternative name", () => {
		const find = (text: string, name: string) =>
			searchPoints(points, text).find(m => m.point.name === name)!

		const swinica = find("wini", "Świnica")
		expect(swinica.nameRanges).toEqual([[1, 5]])
		expect(swinica.alternativeRanges).toEqual([])

		const lomnica = find("stit", "Łomnica")
		expect(lomnica.alternativeRanges).toEqual([[9, 13]])

		const koszysta = find("wiel kos", "Koszysta Wielka")
		expect(koszysta.nameRanges).toEqual([
			[0, 3],
			[9, 13],
		])
	})

	it("returns at most the limit", () => {
		expect(searchPoints(points, "a", 3)).toHaveLength(3)
	})
})
