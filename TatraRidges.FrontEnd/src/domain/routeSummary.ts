import { getClosestDifficulty } from "./difficulty"
import { warningsAdjectives } from "./routeArranger"
import { formatTimeSpan, parseTimeSpan } from "./time"
import {
	AdjectiveData,
	Params,
	RidgeData,
	RouteData,
	RouteDto,
	RouteSummary,
} from "./types"

export interface SummaryData {
	params: Params
	ridges: RidgeData[]
}

// C# Math.Round default: halves go to the even neighbour.
export const roundHalfToEven = (value: number) => {
	const rounded = Math.round(value)
	return Math.abs(value % 1) === 0.5 ? 2 * Math.round(value / 2) : rounded
}

// The time of each route is read many times per summary; parse it once.
const minutesByRoute = new WeakMap<RouteDto, number>()

const routeMinutes = (route: RouteDto) => {
	let minutes = minutesByRoute.get(route)
	if (minutes === undefined) {
		minutes = parseTimeSpan(route.routeTime)
		minutesByRoute.set(route, minutes)
	}
	return minutes
}

export const totalMinutes = (routes: (RouteDto | null)[]) =>
	routes.reduce((sum, r) => (r === null ? sum : sum + routeMinutes(r)), 0)

// Collects how long the route is described with adjectives of one group
// (e.g. "e" for exposure) and picks the group adjective closest to the time-weighted rank.
export class AdjectiveGroupData {
	private readonly breakMost = 0.66
	private readonly breakToLower = 0.15

	private rankTimesMinutes = 0
	private minutes = 0
	private closestAdjective: AdjectiveData | null = null

	constructor(
		readonly id: string,
		private readonly commonAdjectives: AdjectiveData[],
		private readonly allMinutes: number
	) {}

	addTimeAndRank(minutes: number, adjective: AdjectiveData) {
		this.rankTimesMinutes += minutes * adjective.rank
		this.minutes += minutes
	}

	findClosestAdjective() {
		const rank = this.getRank()
		this.closestAdjective = this.commonAdjectives.reduce((closest, a) =>
			Math.abs(a.rank - rank) < Math.abs(closest.rank - rank) ? a : closest
		)
	}

	getText() {
		if (this.closestAdjective === null || this.isToLower()) {
			return ""
		}
		return this.closestAdjective.text.split("Częściowo ").join("").toLowerCase()
	}

	isToLower() {
		return (
			this.minutes < this.breakToLower * this.allMinutes || this.minutes === 0
		)
	}

	isPart() {
		return this.closestAdjective?.id.startsWith("c") || !this.isMost()
	}

	private getRank() {
		return this.minutes === 0 ? 0 : this.rankTimesMinutes / this.minutes
	}

	private isMost() {
		return this.minutes > this.breakMost * this.allMinutes
	}
}

const adjectiveGroup = (adjective: AdjectiveData) => adjective.id.substring(1)

const concatAdjectives = (adjectives: string[]) => {
	let lastItem = ""
	let lastText = ""

	if (adjectives.length > 1) {
		lastItem = adjectives[adjectives.length - 1]
		lastText = " i " + lastItem
	}
	return adjectives.filter(a => a !== lastItem).join(", ") + lastText
}

export const getDescription = (
	routes: RouteDto[],
	adjectives: AdjectiveData[]
) => {
	const groups = adjectives
		.map(adjectiveGroup)
		.filter((group, index, all) => all.indexOf(group) === index)

	const allMinutes = totalMinutes(routes)

	const groupsData = groups.map(
		group =>
			new AdjectiveGroupData(
				group,
				adjectives.filter(a => adjectiveGroup(a) === group),
				allMinutes
			)
	)

	for (const route of routes) {
		for (const routeAdjective of route.descriptionAdjective) {
			const adjective = adjectives.find(a => a.id === routeAdjective.id)
			if (adjective === undefined) {
				throw new Error(`Brak przymiotnika o id ${routeAdjective.id}`)
			}
			const group = groupsData.find(g => g.id === adjectiveGroup(adjective))
			group?.addTimeAndRank(routeMinutes(route), adjective)
		}
	}

	const adjectivesGroups = groupsData.filter(g => !g.isToLower())
	adjectivesGroups.forEach(g => g.findClosestAdjective())

	const partsDescriptions = adjectivesGroups
		.filter(g => g.isPart())
		.map(g => g.getText())
	const mostDescriptions = adjectivesGroups
		.filter(g => !g.isPart())
		.map(g => g.getText())

	const partsText =
		partsDescriptions.length > 0
			? "częściowo " + concatAdjectives(partsDescriptions)
			: ""
	const andText =
		mostDescriptions.length > 0 && partsDescriptions.length > 0 ? "oraz" : ""
	const mostText = concatAdjectives(mostDescriptions)

	return ["Droga", mostText, andText, partsText].filter(t => t !== "").join(" ")
}

const findRouteData = (ridges: RidgeData[], id: number) => {
	for (const ridge of ridges) {
		const route = ridge.routes.find(r => r.id === id)
		if (route !== undefined) {
			return route
		}
	}
	throw new Error(`Brak drogi numer ${id}`)
}

export const getAdditionalDescriptions = (
	routes: RouteDto[],
	warnings: boolean,
	data: SummaryData
) => {
	const routesData: RouteData[] = routes.map(r =>
		findRouteData(data.ridges, r.id)
	)

	const rows = routesData
		.flatMap(r =>
			r.additional.filter(a => a.warning === warnings).map(a => a.description)
		)
		.filter((row, index, all) => all.indexOf(row) === index)

	if (warnings) {
		rows.push(...warningsAdjectives(routesData, data.params))
	}

	const header = warnings ? "zagrożenia" : "dodatkowe informacje"
	return rows.length > 0
		? `Występują drogi zawierające ${header}:\n${rows.join("\n")}`
		: ""
}

const emptyDifficulty = { text: "", value: 0 }

// `null` stands for a ridge section without any described route.
export class RouteSummaryBuilder {
	private readonly summary: RouteSummary = {
		isEmptyRoute: false,
		isConsistentDirection: false,
		routeTime: formatTimeSpan(0),
		maxDifficulty: emptyDifficulty,
		avarageDifficulty: emptyDifficulty,
		rank: 0,
		rappeling: false,
		description: "",
		warning: "",
		info: "",
	}

	constructor(
		private readonly routes: (RouteDto | null)[],
		private readonly data?: SummaryData
	) {}

	setIsEmptyRoute() {
		this.summary.isEmptyRoute = this.routes.some(r => r === null)
		return this
	}

	setIsConsistentDirection() {
		this.summary.isConsistentDirection = this.routes.every(
			r => r === null || r.consistentDirection
		)
		return this
	}

	setRouteTime() {
		this.summary.routeTime = formatTimeSpan(totalMinutes(this.routes))
		return this
	}

	setDifficulties() {
		const routes = this.notEmptyRoutes()
		const allMinutes = totalMinutes(routes)

		const max =
			routes.length > 0 ? Math.max(...routes.map(r => r.difficultyValue)) : 0
		// C# throws DivideByZeroException here when all routes take 0 minutes.
		const avarage =
			routes.length > 0 && allMinutes > 0
				? routes.reduce(
						(sum, r) => sum + r.difficultyValue * routeMinutes(r),
						0
					) / allMinutes
				: 0

		this.summary.maxDifficulty = getClosestDifficulty(
			this.requireData().params,
			max
		)
		this.summary.avarageDifficulty = getClosestDifficulty(
			this.requireData().params,
			avarage
		)
		return this
	}

	setRank() {
		const allMinutes = totalMinutes(this.routes)
		const exactRank =
			allMinutes === 0
				? 0
				: this.notEmptyRoutes().reduce(
						(sum, r) => sum + r.rank * routeMinutes(r),
						0
					) / allMinutes

		this.summary.rank = roundHalfToEven(exactRank)
		return this
	}

	setRappeling() {
		this.summary.rappeling = this.notEmptyRoutes().some(r => r.rappeling)
		return this
	}

	setDescription() {
		this.summary.description = getDescription(
			this.notEmptyRoutes(),
			this.requireData().params.adjectives
		)
		return this
	}

	setInfo() {
		this.summary.info = getAdditionalDescriptions(
			this.notEmptyRoutes(),
			false,
			this.requireData()
		)
		return this
	}

	setWarnings() {
		this.summary.warning = getAdditionalDescriptions(
			this.notEmptyRoutes(),
			true,
			this.requireData()
		)
		return this
	}

	build(): RouteSummary {
		return { ...this.summary }
	}

	private notEmptyRoutes() {
		return this.routes.filter((r): r is RouteDto => r !== null)
	}

	private requireData() {
		if (this.data === undefined) {
			throw new Error("Podsumowanie trasy wymaga parametrów i grani")
		}
		return this.data
	}
}

export const createRouteSummary = (
	routes: (RouteDto | null)[],
	data: SummaryData
) =>
	new RouteSummaryBuilder(routes, data)
		.setIsConsistentDirection()
		.setIsEmptyRoute()
		.setRouteTime()
		.setDifficulties()
		.setRank()
		.setRappeling()
		.setDescription()
		.setInfo()
		.setWarnings()
		.build()
