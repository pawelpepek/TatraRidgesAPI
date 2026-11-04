import dataDispatcher, { signOut, watchSession } from "./dispatch-actions"
import { uiActions } from "./ui-slice"
import type { AppDispatch } from "./index"

export const login = (email: string, password: string) => {
	const props = {
		method: "POST",
		location: "account/login/",
		body: {
			email,
			password,
		},
	}
	// Not uiActions.setLogged itself: its payload would carry the password.
	return dataDispatcher(props, () => uiActions.setLogged(true))
}

export const logout = () => async (dispatch: AppDispatch) => {
	try {
		await signOut()
	} finally {
		dispatch(uiActions.setLogged(false))
	}
}

// Keeps the "logged in" state in step with the Supabase session.
export const syncLogin = () => (dispatch: AppDispatch) =>
	watchSession(isAdmin => dispatch(uiActions.setSessionLogged(isAdmin))).catch(
		() => {
			// Offline: stay logged out; the admin can log in again once online.
		}
	)
