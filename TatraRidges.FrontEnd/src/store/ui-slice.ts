import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	notification: {
		status: "ok",
		title: "",
		message: "",
	},
}

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		showNotification(state, action) {
			state.notification = {
				status: action.payload.status,
				title: action.payload.title,
				message: action.payload.message,
			}
		},
	},
})

export const uiActions = uiSlice.actions

export default uiSlice.reducer
