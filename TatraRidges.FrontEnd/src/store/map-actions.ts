import { pointsActions } from "./map-slice"
import dataDispatcher from "./dispatch-actions"
import { Coordinates } from "../components/types"

export const movePoint = (id: number, coordinates: Coordinates) => {
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

export const deletePointById = (id: number) => {
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

export const postConnectionRidge = (pointId1: number, pointId2: number) => {
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
