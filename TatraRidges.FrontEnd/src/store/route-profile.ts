import { MountainPoint } from "../components/types"
import {
	orientedGeometry,
	PROFILE_STEP,
	RidgeGeometry,
	routeTypeProfile,
} from "./ridge-geometry"
import { RidgeWithRoutes } from "./routeTypes"

export interface ProfileSample {
	distance: number // m from the start of the route
	height: number // m
}

export interface ProfilePoint extends ProfileSample {
	name: string
}

export interface RouteProfile {
	samples: ProfileSample[]
	points: ProfilePoint[] // the route's points, where its sections meet
	length: number
	measured: number // sections with a profile from the laser scan
}

const EARTH_RADIUS = 6371008.8

const distanceBetween = (a: MountainPoint, b: MountainPoint) => {
	const rad = Math.PI / 180
	const dLat = (b.latitude - a.latitude) * rad
	const dLng = (b.longitude - a.longitude) * rad
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(a.latitude * rad) *
			Math.cos(b.latitude * rad) *
			Math.sin(dLng / 2) ** 2
	return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h))
}

// The elevation profile of a found route: along the ridge from the laser scan where there is one
// (as the selected variant goes: strictly, nearly or around the ridge), otherwise a straight line
// between the points' heights.
export const routeProfile = (
	parts: RidgeWithRoutes[],
	geometry: Record<number, RidgeGeometry>
): RouteProfile => {
	const samples: ProfileSample[] = []
	const points: ProfilePoint[] = []
	let offset = 0
	let measured = 0

	parts.forEach((part, index) => {
		const from = part.point1
		const to = part.point2
		if (from === undefined || to === undefined) {
			return
		}
		if (index === 0) {
			points.push({ distance: 0, height: from.evaluation, name: from.name })
		}
		const oriented = orientedGeometry(
			geometry[part.pointsConnectionId],
			from,
			to
		)
		let sectionSamples: ProfileSample[]
		if (oriented !== undefined) {
			const route =
				part.routes.find(r => r.id === part.selectedId) ?? part.routes[0]
			const heights = routeTypeProfile(oriented.profile, route?.routeType.id)
			sectionSamples = heights.map((height, i) => ({
				distance: offset + i * PROFILE_STEP,
				height,
			}))
			measured++
		} else {
			sectionSamples = [
				{ distance: offset, height: from.evaluation },
				{ distance: offset + distanceBetween(from, to), height: to.evaluation },
			]
		}
		// The first sample of a section is the last one of the previous section
		samples.push(...(index === 0 ? sectionSamples : sectionSamples.slice(1)))
		offset = sectionSamples[sectionSamples.length - 1].distance
		points.push({
			distance: offset,
			height: sectionSamples[sectionSamples.length - 1].height,
			name: to.name,
		})
	})

	return { samples, points, length: offset, measured }
}
