import { configureStore } from "@reduxjs/toolkit"
import centerReducer from "./center-slice"
import mapReducer, { pointsActions } from "./map-slice"
import uiReducer from "./ui-slice"
import { startUrlSync } from "./url-sync"

const point = (id: number, latitude: number, longitude: number) => ({
	id,
	name: `Punkt ${id}`,
	evaluation: 2000,
	pointTypeId: 1,
	latitude,
	longitude,
})

const openLink = async (search: string) => {
	window.history.replaceState(null, "", `/${search}`)
	const store = configureStore({
		reducer: { map: mapReducer, center: centerReducer, ui: uiReducer },
	})
	const stop = startUrlSync(
		store as unknown as Parameters<typeof startUrlSync>[0]
	)
	store.dispatch(
		pointsActions.replacePoints({
			data: [point(1, 49.2, 20.0), point(2, 49.21, 20.05)],
		})
	)
	// restore() runs asynchronously once the points are loaded.
	await new Promise(resolve => setTimeout(resolve, 0))
	stop()
	return store.getState()
}

describe("startUrlSync", () => {
	afterEach(() => window.history.replaceState(null, "", "/"))

	test("a link with both points and no map view moves the map to them", async () => {
		const state = await openLink("?from=1&to=2")
		expect(state.map.pointFrom.id).toBe(1)
		expect(state.map.pointTo.id).toBe(2)
		expect(state.center.pointFocus.request).toBe(1)
		expect(state.center.pointFocus.points).toEqual([
			{ latitude: 49.2, longitude: 20.0 },
			{ latitude: 49.21, longitude: 20.05 },
		])
	})

	test("a link with one point moves the map to it", async () => {
		const state = await openLink("?to=2")
		expect(state.center.pointFocus.points).toEqual([
			{ latitude: 49.21, longitude: 20.05 },
		])
	})

	test("a link with the map view keeps that view", async () => {
		const state = await openLink("?m=49.1,20.1,13&from=1&to=2")
		expect(state.map.pointTo.id).toBe(2)
		expect(state.center.pointFocus.request).toBe(0)
	})
})
