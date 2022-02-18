import { createSlice } from "@reduxjs/toolkit"
import {isLoginOk, loginHandler} from "./authorizationHandler"

const initialState = {
	visiblePanel: "search",
	notification: {
		status: "ok",
		message: "",
	},
	visibleAdminPart: "route",
	isLogged: isLoginOk(),
	isRouteVisible:false
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
			state.isRouteVisible=action.payload==="route"
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
			state.isRouteVisible=false
		},
		setAdminPartVisible(state, action) {
			state.visibleAdminPart = action.payload
			state.isRouteVisible=false
		},
		setRouteVisible(state,action)
		{
			state.visiblePanel="route"
			state.isRouteVisible=true
		}
	},
})

export const uiActions = uiSlice.actions

export default uiSlice.reducer
