import dataDispatcher from "./dispatch-actions"
import { uiActions } from "./ui-slice"

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
