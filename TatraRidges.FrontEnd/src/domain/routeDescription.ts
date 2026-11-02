import { warningsAdjectives } from "./routeArranger"
import { routeMinutes, totalMinutes } from "./time"
import { AdjectiveData, Params, RidgeData, RouteData, RouteDto } from "./types"

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
	ridges: RidgeData[],
	params: Params
) => {
	const routesData: RouteData[] = routes.map(r => findRouteData(ridges, r.id))

	const rows = routesData
		.flatMap(r =>
			r.additional.filter(a => a.warning === warnings).map(a => a.description)
		)
		.filter((row, index, all) => all.indexOf(row) === index)

	if (warnings) {
		rows.push(...warningsAdjectives(routesData, params))
	}

	const header = warnings ? "zagrożenia" : "dodatkowe informacje"
	return rows.length > 0
		? `Występują drogi zawierające ${header}:\n${rows.join("\n")}`
		: ""
}
