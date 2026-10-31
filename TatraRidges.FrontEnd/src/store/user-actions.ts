import dataDispatcher, { signOut, watchSession } from "./dispatch-actions"
import { uiActions } from "./ui-slice"
import type { Dispatch } from "@reduxjs/toolkit"

export const login = (email: string, password: string) => {
	const props = {
		method: "POST",
		location: "account/login/",
		body: {
			email,
			password,
		},
        isText:true
	}
	return dataDispatcher(props, uiActions.setLogged)
}

export const logout = () => async (dispatch: Dispatch) => {
	try {
		await signOut()
	} finally {
		dispatch(uiActions.setLogged(false))
	}
}

// Keeps the "logged in" state in step with the Supabase session.
export const syncLogin =
	() =>
	(dispatch: Dispatch, getState: () => { ui: { isLogged: boolean } }) =>
		watchSession(() => {
			if (getState().ui.isLogged) {
				dispatch(uiActions.setLogged(false))
			}
		}).catch(() => {
			// Offline: keep the state; a write would report the missing session anyway.
		})
