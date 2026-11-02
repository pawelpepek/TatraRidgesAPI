import { getClosestDifficulty } from "./difficulty"
import { getAdditionalDescriptions, getDescription } from "./routeDescription"
import { formatTimeSpan, routeMinutes, totalMinutes } from "./time"
import { Params, RidgeData, RouteDto, RouteSummary } from "./types"

export interface SummaryData {
	params: Params
	ridges: RidgeData[]
}

// C# Math.Round default: halves go to the even neighbour.
export const roundHalfToEven = (value: number) => {
	const rounded = Math.round(value)
	return Math.abs(value % 1) === 0.5 ? 2 * Math.round(value / 2) : rounded
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
		const { ridges, params } = this.requireData()
		this.summary.info = getAdditionalDescriptions(
			this.notEmptyRoutes(),
			false,
			ridges,
			params
		)
		return this
	}

	setWarnings() {
		const { ridges, params } = this.requireData()
		this.summary.warning = getAdditionalDescriptions(
			this.notEmptyRoutes(),
			true,
			ridges,
			params
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
