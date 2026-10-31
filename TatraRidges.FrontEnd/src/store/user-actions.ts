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
        isText:true
	}
	return dataDispatcher(props, uiActions.setLogged)
}

export const logout = () => async (dispatch: AppDispatch) => {
	try {
		await signOut()
	} finally {
		dispatch(uiActions.setLogged(false))
	}
}

// Keeps the "logged in" state in step with the Supabase session.
export const syncLogin =
	() =>
	(dispatch: AppDispatch, getState: () => { ui: { isLogged: boolean } }) =>
		watchSession(() => {
			if (getState().ui.isLogged) {
				dispatch(uiActions.setLogged(false))
			}
		}).catch(() => {
			// Offline: keep the state; a write would report the missing session anyway.
		})
