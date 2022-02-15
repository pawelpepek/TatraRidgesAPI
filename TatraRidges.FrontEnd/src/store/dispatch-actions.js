import { uiActions } from "./ui-slice"
import {getMessage} from "./statusCodeMessage"

const fetchData = async props => {
	let url = "https://localhost:44342/api/" + props.location
	if (props.pathPart !== undefined) {
		url += props.pathPart
	}
	const response = await fetch(url, {
		method: props.method,
		headers: {
			"content-type": "application/json;charset=UTF-8",
		},
		body: props.body !== undefined ? JSON.stringify(props.body) : null,
	})
		.then(async response => {
			if (response.ok) {
				if (props.isBody) {
					return await response.json()
				} else {
					return true
				}
			}
			else
			{
				const message=getMessage(response.status)
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
	return async dispatch => {
		const title = getTitleFromMethod(props.method)
		dispatch(
			uiActions.showNotification({
				status: "pending",
				message: title + " danych...",
			})
		)
		try {
			const data = await fetchData(props)

			dispatch(
				uiActions.showNotification({
					status: "success",
					message: "Ok",
				})
			)
			if (data) {
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
