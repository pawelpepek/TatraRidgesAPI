import { createSlice } from "@reduxjs/toolkit"
import { stat } from "fs"

const initialState = {
	visiblePanel: "find",
	notification: {
		status: "ok",
		message: "",
	},
	logged: false,
	visibleAdminPart: "route",
}

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		showNotification(state, action) {
			state.notification = {
				status: action.payload.status,
				message: action.payload.message,
			}
		},
		setPanelVersion(state, action) {
			state.visiblePanel = action.payload
		},
		setLogged(state, action) {
			const logged: boolean = action.payload
			state.logged = logged
			if (state.visiblePanel === "admin") {
				state.visiblePanel = "find"
			}
		},
		setAdminPartVisible(state, action) {
			state.visibleAdminPart = action.payload
		},
	},
})

export const uiActions = uiSlice.actions

export default uiSlice.reducer
