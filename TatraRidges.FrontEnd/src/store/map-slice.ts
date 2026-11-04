import { createSlice, Draft } from "@reduxjs/toolkit"

import {
	MountainPoint,
	ConnectionPoints,
	ConnectionData,
	Coordinates,
} from "../components/types"

import { RidgeAllInformation } from "./routeTypes"

const emptyPoints: MountainPoint[] = []
const emptyConnections: ConnectionPoints[] = []

const initialState = {
	pointFrom: {} as MountainPoint,
	pointTo: {} as MountainPoint,
	points: emptyPoints,
	pointsOk: false,
	connections: emptyConnections,
	ridgeInfo: {} as RidgeAllInformation,
}
const changeCoordinates = (point: MountainPoint, coordinates: Coordinates) => {
	point.latitude = coordinates.latitude
	point.longitude = coordinates.longitude
}
const pointsSlice = createSlice({
	name: "points",
	initialState,
	reducers: {
		replacePoints(state, actions) {
			state.points = actions.payload.data
			state.pointsOk = true
		},
		clearPoints(state, action) {
			state.pointFrom = {} as MountainPoint
			state.pointTo = {} as MountainPoint
		},
		setActualPoint(state, action) {
			if (action.payload.point.id !== state.pointTo.id) {
				state.pointFrom = state.pointTo
				state.pointTo = action.payload.point
			}
		},
		setPoints(state, action) {
			state.pointFrom = action.payload.from ?? ({} as MountainPoint)
			state.pointTo = action.payload.to ?? ({} as MountainPoint)
		},
		// Picked by name: replaces one end; picking the other end's point
		// swaps the ends.
		setPoint(state, action) {
			const point = action.payload.point as MountainPoint
			const isFrom = action.payload.end === "from"
			const other = isFrom ? state.pointTo : state.pointFrom
			const current = isFrom ? state.pointFrom : state.pointTo
			const otherValue = other.id === point.id ? current : other
			state.pointFrom = isFrom ? point : otherValue
			state.pointTo = isFrom ? otherValue : point
		},
		toggleSelectedPoints(state) {
			if (state.pointTo.hasOwnProperty("id")) {
				const tempPoint = state.pointFrom
				state.pointFrom = state.pointTo
				state.pointTo = tempPoint
			}
		},
		deletePoint(state, actions) {
			state.points = state.points.filter(p => p.id !== actions.payload.id)
			state.pointTo = state.pointFrom
			state.pointFrom = {} as MountainPoint
		},
		movePointById(state, actions) {
			const id = actions.payload.id
			const coordinates = actions.payload.body as Coordinates

			const point = state.points.find(p => p.id === id)

			const setPointCoordinates = (
				point: Draft<MountainPoint>,
				coordinates: Coordinates
			) => {
				point.latitude = coordinates.latitude
				point.longitude = coordinates.longitude
			}

			if (point !== undefined) {
				setPointCoordinates(point, coordinates)

				state.connections
					.filter(c => c.point1.id === id)
					.forEach(c => changeCoordinates(c.point1, coordinates))
				state.connections
					.filter(c => c.point2.id === id)
					.forEach(c => changeCoordinates(c.point2, coordinates))

				if (id === state.pointFrom.id) {
					setPointCoordinates(state.pointFrom, coordinates)
				}
				if (id === state.pointTo.id) {
					setPointCoordinates(state.pointTo, coordinates)
				}
			}
		},

		replaceConnections(state, actions) {
			const connectionsData = actions.payload.data as ConnectionData[]
			state.connections = []

			if (state.points.length > 0) {
				for (const c of connectionsData) {
					const point1 = state.points.find(p => p.id === c.pointId1)
					const point2 = state.points.find(p => p.id === c.pointId2)

					if (point1 != undefined && point2 != undefined) {
						state.connections.push({
							id: c.id,
							point1,
							point2,
						})
					}
				}
			}
		},
		connectRidgePoints(state, actions) {
			const point1 = state.points.find(p => p.id === actions.payload.pointId1)
			const point2 = state.points.find(p => p.id === actions.payload.pointId2)

			if (point1 !== undefined && point2 !== undefined) {
				const newConnection: ConnectionPoints = {
					id: actions.payload.data,
					point1,
					point2,
				}
				state.connections.push(newConnection)
			}
		},
		addRidgePoints(state, actions) {
			if (actions.payload.data.pointsRidge !== null) {
				const point1 = state.points.find(p => p.id === actions.payload.pointId1)
				const point2 = state.points.find(p => p.id === actions.payload.pointId2)
				console.log(actions.payload)
				if (point1 !== undefined && point2 !== undefined) {
					const newConnection: ConnectionPoints = {
						id: actions.payload.data.pointsRidge.id,
						point1,
						point2,
					}
					state.connections.push(newConnection)
				}
			}
		},
		getRidge(state, actions) {
			state.ridgeInfo = actions.payload.data
			if (state.ridgeInfo !== ({} as RidgeAllInformation)) {
				state.ridgeInfo.ridgesContainer.forEach(c => {
					c.point1 = state.points.find(p => p.id === c.pointId1)
					c.point2 = state.points.find(p => p.id === c.pointId2)
					c.selectedId = c.routes.length > 0 ? c.routes[0].id : -1
				})
			}
		},
		getSummary(state, actions) {
			state.ridgeInfo.initalRouteSummary = actions.payload.data
		},
		clearRidge(state, actions) {
			state.ridgeInfo = {} as RidgeAllInformation
		},
		setSelectedRoutePartId(state, action) {
			var parts = state.ridgeInfo.ridgesContainer.find(
				r => r.pointsConnectionId == action.payload.connectionId
			)
			if (parts !== undefined) {
				parts.selectedId = action.payload.id
			}
		},
	},
})

export const pointsActions = pointsSlice.actions

export default pointsSlice.reducer
