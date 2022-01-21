import { pointsActions } from "./map-slice"
import { putAction } from "../components/helpers/fetcher"

export const fetchPointsData = () => {
	return async dispatch => {
		const fetchData = async () => {
			const response = await fetch("https://localhost:44342/api/point/")

			if (!response.ok) {
				throw new Error("Could not fetch points data!")
			}

			const data = await response.json()

			return data
		}
		try {
			const pointsData = await fetchData()

			dispatch(
				pointsActions.replacePoints({
					points: pointsData || [],
				})
			)
		} catch (error) {
			// dispatch(
			//   uiActions.showNotification({
			//     status: 'error',
			//     title: 'Error!',
			//     message: 'Fetching cart data failed!',
			//   })
			// );
			console.log("Błąd")
		}
	}
}

export const movePoint = (id, coordinates) => {
	return async dispatch => {
		const loadData = async () => {
			const response = await fetch("https://localhost:44342/api/point/" + id, {
				method: "PUT",
				headers: {
					"content-type": "application/json;charset=UTF-8",
				},
				body: JSON.stringify(coordinates),
			})

			if (!response.ok) {
				throw new Error("Could not fetch points data!")
			} else {
				return true
			}
		}
		console.log(coordinates, id)
		try {
			const loaded = await loadData()
			if (loaded) {
				dispatch(
					pointsActions.movePointById({
						id,
						coordinates,
					})
				)
				return true
			} else {
				return false
			}
		} catch (error) {
			// dispatch(
			//   uiActions.showNotification({
			//     status: 'error',
			//     title: 'Error!',
			//     message: 'Fetching cart data failed!',
			//   })
			// );
			console.log("Błąd")
			return false
		}
	}
}

export const deletePointById = id => {
	return async dispatch => {
		const deleteData = async () => {
			const response = await fetch("https://localhost:44342/api/point/" + id, {
				method: "DELETE",
				headers: {
					"content-type": "application/json;charset=UTF-8",
				},
			})
			if (!response.ok) {
				throw new Error("Could not fetch points data!")
			}
			return true
		}
		try {
			const deleted = await deleteData()
			if (deleted) {
				dispatch(pointsActions.deletePoint({ id }))
				return true
			} else {
				return false
			}
		} catch (error) {
			// dispatch(
			//   uiActions.showNotification({
			//     status: 'error',
			//     title: 'Error!',
			//     message: 'Fetching cart data failed!',
			//   })
			// );
			console.log("Błąd")
			return false
		}
	}
}

export const fetchConnectionsData = () => {
	return async dispatch => {
		const fetchData = async () => {
			const response = await fetch("https://localhost:44342/api/connection/")

			if (!response.ok) {
				throw new Error("Could not fetch points data!")
			}

			const data = await response.json()

			return data
		}
		try {
			const data = await fetchData()

			dispatch(
				pointsActions.replaceConnections({
					connections: data || [],
				})
			)
		} catch (error) {
			// dispatch(
			//   uiActions.showNotification({
			//     status: 'error',
			//     title: 'Error!',
			//     message: 'Fetching cart data failed!',
			//   })
			// );
			console.log("Błąd")
		}
	}
}

export const postConnectionRidge = (pointId1, pointId2) => {
	return async dispatch => {
		let id = -1
		const loadData = async () => {
			const body = {
				pointId1,
				pointId2,
				ridge: true,
			}
			const response = await fetch("https://localhost:44342/api/connection/", {
				method: "POST",
				headers: {
					"content-type": "application/json;charset=UTF-8",
				},
				body: JSON.stringify(body),
			})

			if (!response.ok) {
				throw new Error("Could not fetch connection data!")
			}
			const data = await response.json()

			return data
		}
		try {
			id = await loadData()
			if (id >= 0) {
				dispatch(
					pointsActions.connectRidgePoints({
						id,
						pointId1,
						pointId2,
					})
				)
			}
		} catch (error) {
			// dispatch(
			//   uiActions.showNotification({
			//     status: 'error',
			//     title: 'Error!',
			//     message: 'Fetching cart data failed!',
			//   })
			// );
			console.log("Błąd", id)
		}
		return id
	}
}
