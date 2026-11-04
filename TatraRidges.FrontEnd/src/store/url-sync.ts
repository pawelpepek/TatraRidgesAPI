import type { AppDispatch, RootState } from "./index"
import { getRidge, getSummaryForRoutes } from "./map-actions"
import { pointsActions } from "./map-slice"
import { centerActions } from "./center-slice"
import {
	formatUrlState,
	parseUrlState,
	pickRoutes,
	selectedRoutes,
	UrlState,
} from "./url-state"

interface UrlSyncStore {
	dispatch: AppDispatch
	getState: () => RootState
	subscribe: (listener: () => void) => () => void
}

const isRouteVisible = (state: RootState) =>
	state.ui.visiblePanel.startsWith("route")

const toUrlState = (state: RootState): UrlState => ({
	center: state.center.value,
	mapVersion: state.center.mapVersion,
	from: state.map.pointFrom.id,
	to: state.map.pointTo.id,
	routes:
		isRouteVisible(state) && state.map.ridgeInfo.ridgesContainer !== undefined
			? selectedRoutes(state.map.ridgeInfo.ridgesContainer)
			: undefined,
})

// Selects the points from the address and, if it names routes, shows the route
// between them with the chosen variants. Runs once the points are loaded.
const restore = async (store: UrlSyncStore, url: UrlState) => {
	const { dispatch, getState } = store
	const points = getState().map.points
	const from = points.find(p => p.id === url.from)
	const to = points.find(p => p.id === url.to)
	if (from === undefined && to === undefined) {
		return
	}
	// A single point is the "to" point, as after one click on the map.
	dispatch(
		pointsActions.setPoints(
			from !== undefined && to !== undefined ? { from, to } : { to: to ?? from }
		)
	)
	// A link without the map view shows the whole route, or else its points.
	if (
		from === undefined ||
		to === undefined ||
		url.routes === undefined ||
		!(await dispatch(getRidge(from.id, to.id)))
	) {
		if (url.center === undefined) {
			dispatch(
				centerActions.requestPointFocus(
					[from, to]
						.filter(p => p !== undefined)
						.map(p => ({ latitude: p.latitude, longitude: p.longitude }))
				)
			)
		}
		return
	}
	if (url.center === undefined) {
		dispatch(centerActions.requestRouteFit())
	}
	const ridges = getState().map.ridgeInfo.ridgesContainer
	const picked = pickRoutes(ridges, url.routes)
	if (picked.every((id, i) => id === ridges[i].selectedId)) {
		return
	}
	ridges.forEach((ridge, i) =>
		dispatch(
			pointsActions.setSelectedRoutePartId({
				connectionId: ridge.pointsConnectionId,
				id: picked[i],
			})
		)
	)
	await dispatch(
		getSummaryForRoutes(
			ridges.map((ridge, i) => ({
				routeId: picked[i],
				pointFrom: ridge.pointId1,
			}))
		)
	)
}

// Keeps the page address in step with the map view and the shown route, so a
// link opens the same view. The address is replaced, not pushed: moving the map
// does not add history entries.
export const startUrlSync = (store: UrlSyncStore) => {
	const url = parseUrlState(window.location.search)
	let phase: "waiting" | "restoring" | "done" = "waiting"

	const write = () => {
		const search = formatUrlState(toUrlState(store.getState()))
		if (search !== window.location.search) {
			const { pathname, hash } = window.location
			window.history.replaceState(
				window.history.state,
				"",
				pathname + search + hash
			)
		}
	}

	return store.subscribe(() => {
		if (phase === "done") {
			write()
		} else if (phase === "waiting" && store.getState().map.pointsOk) {
			phase = "restoring"
			restore(store, url).finally(() => {
				phase = "done"
				write()
			})
		}
	})
}
