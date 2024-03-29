import { uiActions } from "./ui-slice"
import { getMessage } from "./statusCodeMessage"

const fetchData = async props => {
	const conf = require("../config.dev.json")
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
