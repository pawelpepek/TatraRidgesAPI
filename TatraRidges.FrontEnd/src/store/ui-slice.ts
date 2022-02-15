import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	visiblePanel: "find",
	notification: {
		status: "ok",
		message: "",
	},
	visibleAdminPart: "route",
	isLogged: localStorage.getItem("token") !== null,
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
			const logged = action.payload.data != null
			state.isLogged = logged
			if (logged) {
				localStorage.setItem("token", action.payload.data)
				state.visiblePanel = "admin"
			} else {
				if (state.visiblePanel === "admin") {
					state.visiblePanel = "find"
				}
				localStorage.removeItem("token")
			}
		},
		setAdminPartVisible(state, action) {
			state.visibleAdminPart = action.payload
		},
	},
})

export const uiActions = uiSlice.actions

export default uiSlice.reducer
