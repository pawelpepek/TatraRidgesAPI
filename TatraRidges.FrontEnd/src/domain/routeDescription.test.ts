import { AdjectiveGroupData } from "./routeDescription"

describe("AdjectiveGroupData.getText", () => {
	const commonAdjectives = [
		{ id: "ce", rank: 5, text: "Częściowo eksponowana" },
		{ id: "de", rank: 4, text: "Dość eksponowana" },
		{ id: "_e", rank: 7, text: "Eksponowana" },
		{ id: "be", rank: 9, text: "Bardzo eksponowana" },
	]
	const adjective = (id: string) => commonAdjectives.find(a => a.id === id)!

	const groupText = (allMinutes: number, items: [string, number][]) => {
		const group = new AdjectiveGroupData("e", commonAdjectives, allMinutes)
		items.forEach(([id, minutes]) =>
			group.addTimeAndRank(minutes, adjective(id))
		)
		group.findClosestAdjective()
		return group.getText()
	}

	// The C# test expected "Częściowo eksponowana" for cases 1 and 4 and "Dość eksponowana"
	// for case 2; the code strips "Częściowo " and lowercases the text.
	it.each([
		[
			300,
			[
				["ce", 60],
				["de", 60],
			],
			"eksponowana",
		],
		[
			70,
			[
				["be", 1],
				["de", 60],
			],
			"dość eksponowana",
		],
		[
			610,
			[
				["be", 1],
				["de", 60],
			],
			"",
		],
		[120, [["_e", 60]], "eksponowana"],
	] as [number, [string, number][], string][])(
		"for %i minutes of route (%#)",
		(allMinutes, items, text) => {
			expect(groupText(allMinutes, items)).toBe(text)
		}
	)

	it("falls back to the closest group adjective for an adjective from outside the group", () => {
		// The C# test expected "" here, but never checked it.
		const group = new AdjectiveGroupData("e", commonAdjectives, 2000)
		group.addTimeAndRank(2000, { id: "oe", rank: 0, text: "" })
		group.findClosestAdjective()
		expect(group.getText()).toBe("dość eksponowana")
	})

	it("returns an empty text when nothing was added", () => {
		expect(groupText(2000, [])).toBe("")
	})
})
