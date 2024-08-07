import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	value: {
		coordinates: {
			latitude: 49.179306,
			longitude: 20.088444,
		},
		zoom: 14,
	},
	mapVersion: 0,
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
	},
})

export const centerActions = centerSlice.actions

export default centerSlice.reducer
