import { RouteSummaryBuilder } from "./routeSummary"
import { formatTimeSpan, totalMinutes } from "./time"
import { RouteDto } from "./types"

// Ported from TatraRidges.Model.UnitTests/Helpers. Several C# tests asserted with
// `.Should().Equals(x)`, which never fails, and some of their expected values were
// wrong; the values below are what the C# code really returns (see csharp-golden.json).

let nextId = 0

class RouteDtoBuilder {
	private readonly route: RouteDto = {
		id: nextId++,
		consistentDirection: false,
		difficultyValue: 1,
		difficulty: "I",
		rappeling: false,
		routeType: { id: 1, name: "Ściśle granią", rank: 2 },
		guideDescription: { guide: "WHP", number: "1", page: 1, volume: 1 },
		rank: 0,
		routeTime: formatTimeSpan(60),
		descriptionAdjective: [],
		info: "",
		warning: "",
	}

	setRappelingTrue() {
		this.route.rappeling = true
		return this
	}

	setConsistentDirectionTrue() {
		this.route.consistentDirection = true
		return this
	}

	setRank(rank: number) {
		this.route.rank = rank
		return this
	}

	setRouteTime(hours: number, minutes: number) {
		this.route.routeTime = formatTimeSpan(hours * 60 + minutes)
		return this
	}

	create() {
		return this.route
	}
}

const builder = () => new RouteDtoBuilder()
const simplyRoute = () => builder().create()
const consistentRoute = () => builder().setConsistentDirectionTrue().create()
const rappelingRoute = () => builder().setRappelingTrue().create()

const summary = (
	routes: (RouteDto | null)[],
	act: (b: RouteSummaryBuilder) => RouteSummaryBuilder
) => act(new RouteSummaryBuilder(routes)).build()

describe("RouteSummaryBuilder.setIsConsistentDirection", () => {
	it.each([
		[[consistentRoute()]],
		[[consistentRoute(), null]],
		[[consistentRoute(), consistentRoute()]],
	])("is true when every route keeps the direction (%#)", routes => {
		expect(
			summary(routes, b => b.setIsConsistentDirection()).isConsistentDirection
		).toBe(true)
	})

	it.each([
		[[simplyRoute()]],
		[[simplyRoute(), null]],
		[[consistentRoute(), simplyRoute()]],
	])("is false when one route goes the other way (%#)", routes => {
		expect(
			summary(routes, b => b.setIsConsistentDirection()).isConsistentDirection
		).toBe(false)
	})
})

describe("RouteSummaryBuilder.setIsEmptyRoute", () => {
	it.each([
		[[null, null]],
		[[null]],
		[[null, simplyRoute()]],
		[[simplyRoute(), null]],
	])("is true when a section has no route (%#)", routes => {
		expect(summary(routes, b => b.setIsEmptyRoute()).isEmptyRoute).toBe(true)
	})

	it.each([[[simplyRoute()]], [[simplyRoute(), rappelingRoute()]]])(
		"is false when every section has a route (%#)",
		routes => {
			expect(summary(routes, b => b.setIsEmptyRoute()).isEmptyRoute).toBe(false)
		}
	)
})

describe("RouteSummaryBuilder.setRappeling", () => {
	it.each([[[rappelingRoute(), null]], [[rappelingRoute(), simplyRoute()]]])(
		"is true when a route needs rappeling (%#)",
		routes => {
			expect(summary(routes, b => b.setRappeling()).rappeling).toBe(true)
		}
	)

	it.each([
		[[null, null]],
		[[simplyRoute()]],
		[[simplyRoute(), null]],
		[[simplyRoute(), simplyRoute()]],
	])("is false otherwise (%#)", routes => {
		expect(summary(routes, b => b.setRappeling()).rappeling).toBe(false)
	})
})

describe("RouteSummaryBuilder.setRouteTime and totalMinutes", () => {
	it.each([
		[[null, null], 0, "00:00:00"],
		[[builder().setRouteTime(1, 0).create()], 60, "01:00:00"],
		[[builder().setRouteTime(1, 0).setRank(-3).create(), null], 60, "01:00:00"],
		[
			[builder().setRouteTime(2, 0).create(), builder().create()],
			180,
			"03:00:00",
		],
		[
			[
				builder().setRouteTime(2, 0).setRank(-2).create(),
				builder().setRouteTime(1, 3).setRank(5).create(),
			],
			183,
			"03:03:00",
		],
		// The C# RouteTimeCounterTests expected 02:05 here, which was never checked.
		[
			[
				builder().setRouteTime(1, 3).create(),
				builder().setRouteTime(2, 5).create(),
			],
			188,
			"03:08:00",
		],
		[
			[
				builder().setRouteTime(20, 0).create(),
				builder().setRouteTime(4, 50).create(),
			],
			1490,
			"1.00:50:00",
		],
	])("sums %# routes", (routes, minutes, routeTime) => {
		expect(totalMinutes(routes)).toBe(minutes)
		expect(summary(routes, b => b.setRouteTime()).routeTime).toBe(routeTime)
	})
})

describe("RouteSummaryBuilder.setRank", () => {
	// The C# SetRankTests called SetRouteTime and compared the time with the rank.
	it.each([
		[[null, null], 0],
		[[builder().setRouteTime(1, 0).setRank(6).create()], 6],
		[[builder().setRouteTime(1, 0).setRank(-3).create(), null], -3],
		[
			[
				builder().setRouteTime(2, 0).setRank(-2).create(),
				builder().setRouteTime(1, 3).setRank(5).create(),
			],
			0,
		],
		[
			[
				builder().setRouteTime(1, 3).create(),
				builder().setRouteTime(2, 5).create(),
			],
			0,
		],
		[[builder().setRank(1).create(), builder().setRank(2).create()], 2],
		[[builder().setRank(2).create(), builder().setRank(3).create()], 2],
		[
			[
				builder().setRouteTime(1, 0).setRank(10).create(),
				builder().setRouteTime(3, 0).setRank(2).create(),
			],
			4,
		],
	])(
		"weights the rank by time, rounding halves to even (%#)",
		(routes, rank) => {
			expect(summary(routes, b => b.setRank()).rank).toBe(rank)
		}
	)
})
