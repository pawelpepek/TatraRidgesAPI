import { createSlice } from "@reduxjs/toolkit"


const initialCounterState = { value: true}

const adminModeSlice = createSlice({
	name: "admin",
	initialState:initialCounterState,
	reducers: {
		toggle(state) {
			state.value=!state.value
		},
	},
})

export const adminModeActions=adminModeSlice.actions

export default adminModeSlice.reducer