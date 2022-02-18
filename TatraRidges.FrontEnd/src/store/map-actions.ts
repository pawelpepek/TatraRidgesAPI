import { Coordinates } from "../components/types"
import dataDispatcher from "./dispatch-actions"
import { pointsActions } from "./map-slice"
import {uiActions} from "./ui-slice"

export const movePoint = (id: number, coordinates: Coordinates) => {
	const props = {
		method: "PUT",
		location: "point/",
		pathPart: id,
		body: coordinates,
		addingInfo: { id },
		token: true,
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
		token: true,
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
		token: true,
	}
	return dataDispatcher(props, pointsActions.connectRidgePoints)
}

export const getRidge = (pointFrom: number, pointTo: number) => {
	const pathPart = `?from=${pointFrom}&to=${pointTo}`
	const props = {
		method: "GET",
		location: "route",
		isBody: true,
		pathPart,
	}
	return dataDispatcher(props, [pointsActions.getRidge,uiActions.setRouteVisible])
}
