import { coordinatesErrorMessage, isCoordinatesValid } from "./coordinates"
import {
	CyclicRidgeError,
	InvalidCoordinateError,
	NotFoundError,
} from "./errors"
import { toPointsRidgeDto } from "./queries"
import { findRidge } from "./ridgeFinder"
import { parseTimeSpan } from "./time"
import {
	AddRouteInput,
	Coordinates,
	PointData,
	RidgeData,
	RouteCreateResult,
	RouteData,
	TatraData,
} from "./types"

// Write side of the former API. Every command is pure: it validates the input and
// returns new arrays. The app writes through the SQL functions of migration
// admin_writes; these stay as the reference.

const nextId = (ids: number[]) =>
	ids.reduce((max, id) => Math.max(max, id), 0) + 1

const requirePoint = (points: PointData[], id: number) => {
	const point = points.find(p => p.id === id)
	if (point === undefined) {
		throw new NotFoundError(`Nie ma punktu z Id = ${id}`)
	}
	return point
}

export const movePoint = (
	points: PointData[],
	id: number,
	coordinates: Coordinates
): PointData[] => {
	if (!isCoordinatesValid(coordinates)) {
		throw new InvalidCoordinateError(coordinatesErrorMessage(coordinates))
	}
	requirePoint(points, id)

	return points.map(p =>
		p.id === id
			? { ...p, lat: coordinates.latitude, lng: coordinates.longitude }
			: p
	)
}

// Removes the point together with all ridges (and their routes) that touch it.
export const deletePoint = (
	data: Pick<TatraData, "points" | "ridges">,
	id: number
): Pick<TatraData, "points" | "ridges"> => {
	requirePoint(data.points, id)

	return {
		points: data.points.filter(p => p.id !== id),
		ridges: data.ridges.filter(r => r.pointId1 !== id && r.pointId2 !== id),
	}
}

export const addConnection = (
	data: Pick<TatraData, "points" | "ridges">,
	pointId1: number,
	pointId2: number
): { ridges: RidgeData[]; ridge: RidgeData } => {
	requirePoint(data.points, pointId1)
	requirePoint(data.points, pointId2)

	if (findRidge(data.ridges, pointId1, pointId2).length > 0) {
		throw new CyclicRidgeError()
	}

	const ridge: RidgeData = {
		id: nextId(data.ridges.map(r => r.id)),
		pointId1,
		pointId2,
		routes: [],
	}
	return { ridges: [...data.ridges, ridge], ridge }
}

const ridgeForPoints = (
	ridges: RidgeData[],
	pointId1: number,
	pointId2: number
) =>
	ridges.find(
		r =>
			(r.pointId1 === pointId1 || r.pointId2 === pointId1) &&
			(r.pointId1 === pointId2 || r.pointId2 === pointId2)
	)

// Keeps one adjective per group (the one with the highest rank), ordered by group.
const selectAdjectives = (data: TatraData, ids: string[]) => {
	const group = (id: string) => id.substring(1)

	return data.params.adjectives
		.filter(a => ids.includes(a.id))
		.sort((a, b) =>
			group(a.id) < group(b.id)
				? -1
				: group(a.id) > group(b.id)
					? 1
					: b.rank - a.rank
		)
		.filter(
			(a, index, all) =>
				all.findIndex(o => group(o.id) === group(a.id)) === index
		)
		.map(a => a.id)
}

export const addRoute = (
	data: TatraData,
	input: AddRouteInput
): { ridges: RidgeData[]; result: RouteCreateResult } => {
	const detail = data.params.difficultyDetails.find(
		d => d.sign === input.difficultySign
	)
	if (detail === undefined) {
		throw new NotFoundError(`Nieznany znak trudności "${input.difficultySign}"`)
	}

	let ridges = data.ridges
	let ridge = ridgeForPoints(ridges, input.pointId1, input.pointId2)
	const isNewConnection = ridge === undefined

	if (ridge === undefined) {
		const added = addConnection(data, input.pointId1, input.pointId2)
		ridges = added.ridges
		ridge = added.ridge
	}

	const route: RouteData = {
		id: nextId(ridges.flatMap(r => r.routes.map(rt => rt.id))),
		consistentDirection: ridge.pointId1 === input.pointId1,
		difficultyId: input.difficultyValue,
		difficultyDetailId: detail.id,
		rappeling: input.rappeling,
		routeTypeId: input.routeType,
		routeTimeMin: parseTimeSpan(input.routeTime),
		guideId: input.guideDescription.guideId,
		guideNumber: input.guideDescription.number,
		guidePage: input.guideDescription.page,
		guideVolume: input.guideDescription.volume,
		adjectiveIds: selectAdjectives(data, input.adjectives),
		additional: input.additionalDescriptions.map(d => ({
			description: d.description,
			warning: d.warning,
		})),
	}

	const target = ridge
	const updated = { ...target, routes: [...target.routes, route] }

	return {
		ridges: ridges.map(r => (r === target ? updated : r)),
		result: {
			routeId: route.id,
			pointsRidge: isNewConnection
				? toPointsRidgeDto(updated, data.points)
				: null,
		},
	}
}
