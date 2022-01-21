import { pointsActions } from "./map-slice"

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
	if (!response.ok) {
		console.log(response, props)
		throw new Error("Serwer nie odpowiada!")
	}
	if (props.isBody) {
		return await response.json()
	} else {
		return true
	}
}

export const dataDispatcher = (props, dispatcher) => {
	return async dispatch => {
		// try {
		const data = await fetchData(props)
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
		// } catch (error) {
		// 	// dispatch(
		// 	//   uiActions.showNotification({
		// 	//     status: 'error',
		// 	//     title: 'Error!',
		// 	//     message: 'Fetching cart data failed!',
		// 	//   })
		// 	// );
		// 	console.log("Błąd")
		// }
		return false
	}
}
export const movePoint = (id, coordinates) => {
	const props = {
		method: "PUT",
		location: "point/",
		pathPart: id,
		body: coordinates,
		addingInfo: { id },
	}
	return dataDispatcher(props, pointsActions.movePointById)
}

export const fetchPointsData = () => {
	const props = {
		method: "GET",
		location: "point",
		isBody: true,
	}
	return dataDispatcher(props, pointsActions.replacePoints)
}

export const deletePointById = id => {
	const props = {
		method: "DELETE",
		location: "point/",
		pathPart: id,
		addingInfo: { id },
	}
	return dataDispatcher(props, pointsActions.deletePoint)
}

export const fetchConnectionsData = () => {
	const props = {
		method: "GET",
		location: "connection",
		isBody: true,
	}
	return dataDispatcher(props, pointsActions.replaceConnections)
}

export const postConnectionRidge = (pointId1, pointId2) => {
	const body = {
		pointId1,
		pointId2,
		ridge: true,
	}
	const props = {
		method: "POST",
		location: "connection",
		body,
		addingInfo: { pointId1, pointId2 },
	}
	return dataDispatcher(props, pointsActions.connectRidgePoints)
}
