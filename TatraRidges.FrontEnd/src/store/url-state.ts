import { Coordinates } from "../components/types"
import { RidgeWithRoutes } from "./routeTypes"

// The map view and the shown route kept in the page address, e.g.
// ?m=49.17931,20.08844,14&from=123&to=456&r=1001.1002&l=1
export interface UrlState {
	center?: { coordinates: Coordinates; zoom: number }
	mapVersion?: number
	from?: number
	to?: number
	// Present when the route is shown: the chosen variants of its sections.
	routes?: number[]
}

const maxZoom = 17

const parseId = (value: string | null) => {
	if (value === null || !/^\d+$/.test(value)) {
		return undefined
	}
	const id = Number(value)
	return id > 0 && Number.isSafeInteger(id) ? id : undefined
}

const parseCenter = (value: string | null) => {
	const parts = value?.split(",") ?? []
	if (parts.length !== 3 || parts.some(p => p.trim() === "")) {
		return undefined
	}
	const [latitude, longitude, zoom] = parts.map(Number)
	const valid =
		Math.abs(latitude) <= 90 &&
		Math.abs(longitude) <= 180 &&
		Number.isInteger(zoom) &&
		zoom >= 0 &&
		zoom <= maxZoom
	return valid ? { coordinates: { latitude, longitude }, zoom } : undefined
}

export const parseUrlState = (search: string): UrlState => {
	const query = new URLSearchParams(search)
	const state: UrlState = {}

	const center = parseCenter(query.get("m"))
	if (center !== undefined) {
		state.center = center
	}
	const mapVersion = query.get("l")
	if (mapVersion === "0" || mapVersion === "1") {
		state.mapVersion = Number(mapVersion)
	}
	const from = parseId(query.get("from"))
	if (from !== undefined) {
		state.from = from
	}
	const to = parseId(query.get("to"))
	if (to !== undefined) {
		state.to = to
	}
	const routes = query.get("r")
	if (routes !== null) {
		state.routes = routes
			.split(".")
			.map(parseId)
			.filter((id): id is number => id !== undefined)
	}
	return state
}

// About 1 m of precision; trailing zeros dropped.
const formatCoordinate = (value: number) => String(Number(value.toFixed(5)))

// Built by hand so commas and dots stay readable instead of %2C.
export const formatUrlState = (state: UrlState) => {
	const params: string[] = []
	if (state.center !== undefined) {
		const { coordinates, zoom } = state.center
		params.push(
			`m=${formatCoordinate(coordinates.latitude)},${formatCoordinate(
				coordinates.longitude
			)},${Math.round(zoom)}`
		)
	}
	if (state.from !== undefined) {
		params.push(`from=${state.from}`)
	}
	if (state.to !== undefined) {
		params.push(`to=${state.to}`)
	}
	if (state.routes !== undefined) {
		params.push(`r=${state.routes.join(".")}`)
	}
	if (state.mapVersion !== undefined && state.mapVersion !== 0) {
		params.push(`l=${state.mapVersion}`)
	}
	return params.length > 0 ? `?${params.join("&")}` : ""
}

// The variant to select on each section. Route ids are unique, so a variant
// is matched to its section whatever its position in the address; sections
// without a matching id (a removed route, a changed ridge) keep their default.
export const pickRoutes = (ridges: RidgeWithRoutes[], routes: number[]) => {
	const wanted = new Set(routes)
	return ridges.map(
		ridge => ridge.routes.find(r => wanted.has(r.id))?.id ?? ridge.selectedId
	)
}

// The selected variant of each section that has one.
export const selectedRoutes = (ridges: RidgeWithRoutes[]) =>
	ridges.map(r => r.selectedId).filter(id => id > 0)
