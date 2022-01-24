import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	value:{
		coordinates:{
			latitude: 49.219417,
			longitude: 20.009306,
		},
		zoom:16
	}
}

const centerSlice = createSlice({
	name: "coordinates",
	initialState,
	reducers: {
		setValues(state, action) {
			state.value = action.payload
		},
	},
})

export const centerActions = centerSlice.actions

export default centerSlice.reducer
