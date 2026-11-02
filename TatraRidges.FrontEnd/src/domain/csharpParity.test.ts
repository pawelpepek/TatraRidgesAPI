import {
	csharpGolden,
	data,
	roundNumbers,
	scenario,
} from "./__fixtures__/scenarioData"
import { getAllDifficulties, getClosestDifficulty } from "./difficulty"
import { NotFoundError } from "./errors"
import { getRouteBetweenPoints, getRouteSummary } from "./queries"
import { findRidge } from "./ridgeFinder"
import { AdjectiveGroupData } from "./routeDescription"
import { RouteSummaryBuilder } from "./routeSummary"
import { formatTimeSpan } from "./time"
import { RouteDto, RouteIdFrom } from "./types"

describe("parity with the C# implementation", () => {
	describe.each(scenario.ridgeQueries.map((q, i) => [q[0], q[1], i]))(
		"route between points %i and %i",
		(from, to, index) => {
			const expected = csharpGolden.ridgeQueries[index]

			it("finds the same ridge path", () => {
				const path = findRidge(data.ridges, from, to).map(p => ({
					connectionId: p.ridge.id,
					consistDirection: p.consistDirection,
				}))
				expect(path).toEqual(expected.path)
			})

			it("returns the same ridges, routes and initial summary", () => {
				const result = getRouteBetweenPoints(data, from, to)
				expect(roundNumbers(result)).toEqual(roundNumbers(expected.info))
			})
		}
	)

	describe.each(
		scenario.summaryQueries.map((q, i): [number, RouteIdFrom[]] => [i, q])
	)("summary query %i", (index, query) => {
		// Deliberate change: the C# RoutesConverter flipped the direction of routes
		// stored with consistentDirection = false (routes 5 and 11 in queries 0 and 4).
		const fixedDirections: Record<number, boolean> = { 0: true, 4: true }
		const golden = csharpGolden.summaryQueries[index]
		const expected =
			index in fixedDirections
				? { ...golden, isConsistentDirection: fixedDirections[index] }
				: golden

		it("returns the same summary", () => {
			if (expected.error) {
				expect(() => getRouteSummary(data, query)).toThrow(NotFoundError)
				expect(() => getRouteSummary(data, query)).toThrow(expected.message)
			} else {
				expect(roundNumbers(getRouteSummary(data, query))).toEqual(
					roundNumbers(expected)
				)
			}
		})
	})

	it("lists the same difficulties", () => {
		expect(roundNumbers(getAllDifficulties(data.params))).toEqual(
			roundNumbers(csharpGolden.allDifficulties)
		)
	})

	it("picks the same closest difficulties", () => {
		const result = scenario.difficultyValues.map(v =>
			getClosestDifficulty(data.params, v)
		)
		expect(roundNumbers(result)).toEqual(
			roundNumbers(csharpGolden.closestDifficulties)
		)
	})

	it("describes adjective groups the same way", () => {
		const result = scenario.units.adjectiveGroupCases.map(c => {
			const group = new AdjectiveGroupData(
				"e",
				scenario.units.commonAdjectives,
				c.allMinutes
			)
			c.items.forEach(item =>
				group.addTimeAndRank(item.minutes, item.adjective)
			)
			group.findClosestAdjective()
			return group.getText()
		})
		expect(result).toEqual(csharpGolden.adjectiveGroupTexts)
	})

	describe("rank and time of routes", () => {
		const routes = scenario.units.rankCases.map(rc =>
			rc.map(r =>
				r === null
					? null
					: ({
							rank: r.rank,
							routeTime: formatTimeSpan(r.minutes),
						} as RouteDto)
			)
		)

		it("rounds the rank the same way", () => {
			const result = routes.map(
				r => new RouteSummaryBuilder(r).setRank().build().rank
			)
			expect(result).toEqual(csharpGolden.ranks)
		})

		it("sums the time the same way", () => {
			const result = routes.map(
				r => new RouteSummaryBuilder(r).setRouteTime().build().routeTime
			)
			expect(result).toEqual(csharpGolden.routeTimes)
		})
	})
})
