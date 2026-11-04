import { Coordinates } from "../components/types"

// Ridge lines and profiles from the airborne laser scan (get_ridge_geometry, migration
// 20261104120000_ridge_geometry; computed by tools/elevation).
export interface RidgeGeometry {
	id: number
	// [lat, lng] from the connection's PointId1 to PointId2, already simplified
	line: [number, number][]
	// heights in metres every PROFILE_STEP m along the exact ridge, from PointId1
	profile: number[]
}

export const PROFILE_STEP = 2
// Corner rounding of the stored line when drawn (chosen together with its 25 m simplification)
export const ROUNDING_STEPS = 4

// Width of the ridge features a route type goes around (route type ids from "RouteTypes")
const BYPASS_WIDTH: Record<number, number> = {
	2: 24, // Prawie ściśle granią: small teeth
	3: 120, // Obchodząc grań: whole towers
}

// Chaikin corner cutting; the ends stay where they are.
export const roundCorners = (
	line: [number, number][],
	steps = ROUNDING_STEPS
) => {
	let points = line
	for (let step = 0; step < steps && points.length > 2; step++) {
		const next: [number, number][] = [points[0]]
		for (let i = 0; i < points.length - 1; i++) {
			const [aLat, aLng] = points[i]
			const [bLat, bLng] = points[i + 1]
			if (i > 0) {
				next.push([0.75 * aLat + 0.25 * bLat, 0.75 * aLng + 0.25 * bLng])
			}
			if (i < points.length - 2) {
				next.push([0.25 * aLat + 0.75 * bLat, 0.25 * aLng + 0.75 * bLng])
			}
		}
		next.push(points[points.length - 1])
		points = next
	}
	return points
}

const samePlace = ([lat, lng]: [number, number], point: Coordinates) =>
	Math.abs(lat - point.latitude) < 1e-6 &&
	Math.abs(lng - point.longitude) < 1e-6

// The geometry in the direction from → to, or undefined when its ends are not these points
// (e.g. one of them was moved after the geometry was computed).
export const orientedGeometry = (
	geometry: RidgeGeometry | undefined,
	from: Coordinates,
	to: Coordinates
) => {
	if (geometry === undefined || geometry.line.length < 2) {
		return undefined
	}
	const first = geometry.line[0]
	const last = geometry.line[geometry.line.length - 1]
	if (samePlace(first, from) && samePlace(last, to)) {
		return { line: geometry.line, profile: geometry.profile }
	}
	if (samePlace(first, to) && samePlace(last, from)) {
		return {
			line: [...geometry.line].reverse(),
			profile: [...geometry.profile].reverse(),
		}
	}
	return undefined
}

const slidingExtreme = (
	values: number[],
	half: number,
	pick: (a: number, b: number) => number
) =>
	values.map((_, i) => {
		let result = values[i]
		for (
			let j = Math.max(0, i - half);
			j <= Math.min(values.length - 1, i + half);
			j++
		) {
			result = pick(result, values[j])
		}
		return result
	})

const movingAverage = (values: number[], half: number) =>
	values.map((_, i) => {
		let sum = 0
		let count = 0
		for (
			let j = Math.max(0, i - half);
			j <= Math.min(values.length - 1, i + half);
			j++
		) {
			sum += values[j]
			count++
		}
		return sum / count
	})

// Profile of a route that goes around ridge features narrower than width metres: a morphological
// opening cuts the bumps and keeps the notches (a bypass traverses below the towers), a short
// moving average removes the steps, and near both ends the profile returns to the ridge,
// because the section starts and ends on its points.
export const bypassProfile = (
	profile: number[],
	width: number,
	step = PROFILE_STEP
) => {
	const half = Math.max(1, Math.round(width / 2 / step))
	const opened = movingAverage(
		slidingExtreme(slidingExtreme(profile, half, Math.min), half, Math.max),
		2
	)
	const last = profile.length - 1
	return profile.map((height, i) => {
		const t = Math.min(1, (Math.min(i, last - i) * step) / (width / 2))
		return t * opened[i] + (1 - t) * height
	})
}

// The profile as the route type goes: strictly on the ridge, nearly, or around it.
export const routeTypeProfile = (profile: number[], routeTypeId: number) => {
	const width = BYPASS_WIDTH[routeTypeId]
	return width === undefined ? profile : bypassProfile(profile, width)
}
