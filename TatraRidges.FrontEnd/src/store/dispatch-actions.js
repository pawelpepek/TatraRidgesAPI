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

const dataDispatcher = (props, dispatcher) => {
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

export default dataDispatcher