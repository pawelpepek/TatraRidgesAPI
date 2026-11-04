import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
	visiblePanel: "search",
	notification: {
		status: "ok",
		message: "",
	},
	visibleAdminPart: "route",
	selectedRoutePart: -1,
	// Follows the admin's Supabase session (syncLogin), so it starts as false.
	isLogged: false,
}

const setLoggedState = (state: typeof initialState, logged: boolean) => {
	state.isLogged = logged
	if (!logged && state.visiblePanel === "admin") {
		state.visiblePanel = "search"
	}
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
		// After the login form (true) or logout (false).
		setLogged(state, action: PayloadAction<unknown>) {
			setLoggedState(state, Boolean(action.payload))
			if (state.isLogged) {
				state.visiblePanel = "admin"
			}
		},
		// The session found on page load, or its end later.
		setSessionLogged(state, action: PayloadAction<boolean>) {
			setLoggedState(state, action.payload)
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
