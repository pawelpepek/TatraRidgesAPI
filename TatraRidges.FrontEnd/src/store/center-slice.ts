import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Coordinates } from "../domain"
import { parseUrlState } from "./url-state"

// The map is created with the view from the address, if it has one.
const fromUrl = parseUrlState(window.location.search)

const initialState = {
	value: fromUrl.center ?? {
		coordinates: {
			latitude: 49.179306,
			longitude: 20.088444,
		},
		zoom: 14,
	},
	mapVersion: fromUrl.mapVersion ?? 0,
	// Raised to fit the map to the shown route.
	routeFitRequest: 0,
	// Raised to show a point picked by name, or both ends from a link.
	pointFocus: {
		request: 0,
		points: [] as Coordinates[],
	},
}

const centerSlice = createSlice({
	name: "coordinates",
	initialState,
	reducers: {
		setValues(state, action) {
			state.value = action.payload
		},
		setVersion(state, action) {
			state.mapVersion = action.payload
		},
		requestRouteFit(state) {
			state.routeFitRequest++
		},
		requestPointFocus(state, action: PayloadAction<Coordinates[]>) {
			state.pointFocus.request++
			state.pointFocus.points = action.payload
		},
	},
})

export const centerActions = centerSlice.actions

export default centerSlice.reducer
