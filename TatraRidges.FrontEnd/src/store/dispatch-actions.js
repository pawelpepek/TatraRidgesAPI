import { uiActions } from "./ui-slice"
import { getMessage } from "./statusCodeMessage"

// With VITE_SUPABASE_URL set (.env, .env.development) the data comes from Supabase
// and is computed locally. Builds without it still call the old API.
// The Supabase SDK is loaded on demand, so those builds do not include it.
const useSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

// The old API's address is in src/config.dev.json, which is outside git and may be missing.
const oldApiConfig = import.meta.glob("../config.dev.json", { import: "default" })

export const signOut = async () => {
	if (useSupabase) {
		const { signOutFromSupabase } = await import("./supabase-data")
		await signOutFromSupabase()
	}
}

export const watchSession = async onSignedOut => {
	if (useSupabase) {
		const { watchAdminSession } = await import("./supabase-data")
		await watchAdminSession(onSignedOut)
	}
}

const fetchData = async props => {
	if (useSupabase) {
		const { fetchFromSupabase } = await import("./supabase-data")
		return fetchFromSupabase(props)
	}

	const loadConfig = oldApiConfig["../config.dev.json"]
	if (loadConfig === undefined) {
		throw new Error("Brak konfiguracji: ustaw VITE_SUPABASE_URL w pliku .env")
	}
	const conf = await loadConfig()
	let url = conf.webAPI + props.location
	if (props.pathPart !== undefined) {
		url += props.pathPart
	}
	const headers = {
		"content-type": "application/json;charset=UTF-8",
	}

	if (props.token) {
		headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`
	}
	const response = await fetch(url, {
		method: props.method,
		headers,
		body: props.body !== undefined ? JSON.stringify(props.body) : null,
	})
		.then(async response => {
			if (response.ok) {
				if (props.isBody) {
					return await response.json()
				} else if (props.isText) {
					return await response.text()
				} else {
					return true
				}
			} else {
				const message = getMessage(response.status)
				throw new Error(message)
			}
		})
		.catch(error => {
			throw new Error(error.message)
		})
	return response
}

const getTitleFromMethod = method => {
	switch (method) {
		case "POST":
			return "Wgrywanie"
		case "PUT":
			return "Aktualizacja"
		case "DELETE":
			return "Usuwanie"
		case "GET":
		case "":
		case undefined:
		case null:
			return "Wczytywanie"
		default:
			throw new Error("Niepoprawna metoda łączenia z bazą danych!")
	}
}

const dataDispatcher = (props, dispatcher) => {
	const title = getTitleFromMethod(props.method)

	return async dispatch => {
		const pendingStatus = props.pendingInfo ? "pendingInfo" : "pending"

		dispatch(
			uiActions.showNotification({
				status: pendingStatus,
				message: title + " danych...",
			})
		)
		try {
			const makeDispatch = (props, dispatcher) => {
				if (
					props.body != null ||
					data !== true ||
					props.addingInfo != undefined
				) {
					dispatch(
						dispatcher({
							body: props.body,
							data,
							...props.addingInfo,
						})
					)
				} else {
					dispatch(dispatcher())
				}
			}

			const data = await fetchData(props)

			dispatch(
				uiActions.showNotification({
					status: "success",
					message: "Ok",
				})
			)
			if (data) {
				let dispatchers = dispatcher
				if (Object.prototype.toString.call(dispatcher) !== "[object Array]") {
					dispatchers = new Array()
					dispatchers.push(dispatcher)
				}
				for (const dis of dispatchers) {
					makeDispatch(props, dis)
				}
				return true
			}
		} catch (error) {
			dispatch(
				uiActions.showNotification({
					status: "error",
					message: error.message,
				})
			)
		}
		return false
	}
}

export default dataDispatcher
