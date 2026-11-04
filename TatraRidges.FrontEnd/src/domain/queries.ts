import { getAllDifficulties } from "./difficulty"
import { NotFoundError } from "./errors"
import { arrangeRoutes, getRouteDto } from "./routeArranger"
import { findRidge } from "./ridgeFinder"
import { createRouteSummary } from "./routeSummary"
import {
	MountainPointDto,
	Params,
	ParametersDto,
	PointData,
	PointsRidgeDto,
	RidgeAllInformation,
	RidgeData,
	RouteDto,
	RouteIdFrom,
	TatraData,
} from "./types"

// Read side of the former API: GET point, GET connection, GET route,
// POST route/parts and GET route/parameters.

export const getMountainPoints = (points: PointData[]): MountainPointDto[] =>
	points.map(p => ({
		id: p.id,
		pointTypeId: p.pointTypeId,
		name: p.name,
		alternativeName: p.altName || null,
		evaluation: p.evaluation,
		latitude: p.lat,
		longitude: p.lng,
	}))

const findPoint = (points: PointData[], id: number) => {
	const point = points.find(p => p.id === id)
	if (point === undefined) {
		throw new NotFoundError(`Nie ma punktu z Id = ${id}`)
	}
	return point
}

export const toPointsRidgeDto = (
	ridge: RidgeData,
	points: PointData[]
): PointsRidgeDto => {
	const from = findPoint(points, ridge.pointId1)
	const to = findPoint(points, ridge.pointId2)
	return {
		id: ridge.id,
		pointId1: ridge.pointId1,
		pointId2: ridge.pointId2,
		pointFrom: { latitude: from.lat, longitude: from.lng },
		pointTo: { latitude: to.lat, longitude: to.lng },
	}
}

export const getRidges = (data: TatraData): PointsRidgeDto[] =>
	data.ridges.map(r => toPointsRidgeDto(r, data.points))

// The API answered 404 when `ridgesContainer` came back empty.
export const getRouteBetweenPoints = (
	data: TatraData,
	from: number,
	to: number
): RidgeAllInformation => {
	const ridgesContainer = arrangeRoutes(
		findRidge(data.ridges, from, to),
		data.params
	)
	const initialRoutes = ridgesContainer.map(r =>
		r.routes.length > 0 ? r.routes[0] : null
	)

	return {
		ridgesContainer,
		initalRouteSummary: createRouteSummary(initialRoutes, data),
	}
}

const convertRoute = (data: TatraData, routeIdFrom: RouteIdFrom): RouteDto => {
	const ridge = data.ridges.find(r =>
		r.routes.some(rt => rt.id === routeIdFrom.routeId)
	)
	const route = ridge?.routes.find(rt => rt.id === routeIdFrom.routeId)
	if (ridge === undefined || route === undefined) {
		throw new NotFoundError(`Brak drogi numer ${routeIdFrom.routeId}`)
	}

	// getRouteDto expects the direction of the ridge, as in getRouteBetweenPoints.
	// The C# RoutesConverter passed the direction of the route instead, which flipped
	// routes stored with consistentDirection = false.
	const consistDirection = routeIdFrom.pointFrom === ridge.pointId1

	return getRouteDto(route, consistDirection, data.params)
}

export const getRouteSummary = (data: TatraData, routesIdFrom: RouteIdFrom[]) =>
	createRouteSummary(
		routesIdFrom.map(r => convertRoute(data, r)),
		data
	)

export const getParameters = (params: Params): ParametersDto => ({
	adjectives: params.adjectives.map(a => ({ id: a.id, text: a.text })),
	difficulties: getAllDifficulties(params),
	guides: params.guides.map(g => ({
		id: g.id,
		shortName: g.shortName,
		name: g.name,
		author: g.author,
	})),
	routeTypes: params.routeTypes.map(t => ({
		id: t.id,
		name: t.name,
		rank: t.rank,
	})),
})
