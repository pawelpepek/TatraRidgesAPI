import { getValueForDifficulty } from "./difficulty"
import { formatTimeSpan, parseTimeSpan } from "./time"
import {
	AdjectiveData,
	Params,
	PointsConnectionWithDirection,
	RidgeWithRoutesDto,
	RouteData,
	RouteDto,
} from "./types"

const findById = <T extends { id: unknown }>(
	items: T[],
	id: T["id"],
	what: string
) => {
	const item = items.find(i => i.id === id)
	if (item === undefined) {
		throw new Error(`Brak ${what} o id ${id}`)
	}
	return item
}

export const routeAdjectives = (
	route: RouteData,
	params: Params
): AdjectiveData[] =>
	route.adjectiveIds.map(id => findById(params.adjectives, id, "przymiotnika"))

// The most fragile ("k" group) adjective below rank -5, if any.
export const warningsAdjectives = (routes: RouteData[], params: Params) =>
	routes
		.flatMap(r => routeAdjectives(r, params))
		.filter(a => a.id.substring(1) === "k" && a.rank < -5)
		.sort((a, b) => a.rank - b.rank)
		.slice(0, 1)
		.map(a => a.text)

const getDescription = (route: RouteData, warning: boolean, params: Params) => {
	const descriptions = route.additional
		.filter(r => r.warning === warning)
		.map(r => r.description)

	if (warning) {
		descriptions.push(...warningsAdjectives([route], params))
	}

	return descriptions.join("\n")
}

// consistDirection: whether the ridge is walked from its pointId1 to pointId2.
export const getRouteDto = (
	route: RouteData,
	consistDirection: boolean,
	params: Params
): RouteDto => {
	const difficulty = findById(
		params.difficulties,
		route.difficultyId,
		"trudności"
	)
	const detail = findById(
		params.difficultyDetails,
		route.difficultyDetailId,
		"trudności"
	)
	const routeType = findById(params.routeTypes, route.routeTypeId, "typu drogi")
	const guide = findById(params.guides, route.guideId, "przewodnika")
	const adjectives = routeAdjectives(route, params)

	return {
		id: route.id,
		consistentDirection: consistDirection
			? route.consistentDirection
			: !route.consistentDirection,
		difficultyValue: getValueForDifficulty(difficulty, detail),
		difficulty: difficulty.text + detail.sign,
		rappeling: route.rappeling,
		routeType: { id: routeType.id, name: routeType.name, rank: routeType.rank },
		guideDescription: {
			guide: guide.shortName,
			number: route.guideNumber,
			page: route.guidePage,
			volume: route.guideVolume,
		},
		rank: adjectives.reduce((sum, a) => sum + a.rank, 0),
		routeTime: formatTimeSpan(route.routeTimeMin),
		descriptionAdjective: adjectives.map(a => ({ id: a.id, text: a.text })),
		info: getDescription(route, false, params),
		warning: getDescription(route, true, params),
	}
}

const compareRoutes = (a: RouteDto, b: RouteDto) =>
	Number(b.consistentDirection) - Number(a.consistentDirection) ||
	a.routeType.rank - b.routeType.rank ||
	b.rank - a.rank ||
	b.difficultyValue - a.difficultyValue ||
	Number(a.rappeling) - Number(b.rappeling) ||
	parseTimeSpan(a.routeTime) - parseTimeSpan(b.routeTime)

const getRidgeWithRoutesDto = (
	ridgePart: PointsConnectionWithDirection,
	params: Params
): RidgeWithRoutesDto => {
	const { ridge, consistDirection } = ridgePart

	return {
		pointId1: consistDirection ? ridge.pointId1 : ridge.pointId2,
		pointId2: consistDirection ? ridge.pointId2 : ridge.pointId1,
		pointsConnectionId: ridge.id,
		routes: ridge.routes
			.map(r => getRouteDto(r, consistDirection, params))
			.sort(compareRoutes),
	}
}

export const arrangeRoutes = (
	ridgeRoute: PointsConnectionWithDirection[],
	params: Params
) => ridgeRoute.map(r => getRidgeWithRoutesDto(r, params))
