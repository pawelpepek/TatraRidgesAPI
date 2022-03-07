import { createSlice } from "@reduxjs/toolkit"
import { isLoginOk, loginHandler } from "./authorizationHandler"

const initialState = {
	visiblePanel: "search",
	notification: {
		status: "ok",
		message: "",
	},
	visibleAdminPart: "route",
	selectedRoutePart: -1,
	isLogged: isLoginOk(),
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
			if (logged) {
				loginHandler(action.payload.data)
				state.visiblePanel = "admin"
			} else {
				if (state.visiblePanel === "admin") {
					state.visiblePanel = "search"
				}
				localStorage.removeItem("token")
			}
			state.isLogged = isLoginOk()
		},
		setAdminPartVisible(state, action) {
			state.visibleAdminPart = action.payload
		},
		setRouteVisible(state, action) {
			state.visiblePanel = "route"
		},
		setRoutePartVisible(state, action) {
			state.selectedRoutePart = action.payload
		},
	},
})

export const uiActions = uiSlice.actions

export default uiSlice.reducer
