import { createSlice } from "@reduxjs/toolkit"

import {
	MountainPoint,
	ConnectionPoints,
	ConnectionData,
	Coordinates,
} from "../components/types"

const emptyPoints: MountainPoint[] = []
const emptyConnections: ConnectionPoints[] = []

const initialState = {
	pointFrom: {} as MountainPoint,
	pointTo: {} as MountainPoint,
	points: emptyPoints,
	pointsOk: false,
	connections: emptyConnections,
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
		setActualPoint(state, action) {
			if (action.payload.point.id !== state.pointTo.id) {
				state.pointFrom = state.pointTo
				state.pointTo = action.payload.point
			}
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

			if (point !== undefined) {
				point.latitude = coordinates.latitude
				point.longitude = coordinates.longitude

				state.connections
					.filter(c => c.point1.id === id)
					.forEach(c => changeCoordinates(c.point1, coordinates))
				state.connections
					.filter(c => c.point2.id === id)
					.forEach(c => changeCoordinates(c.point2, coordinates))
			}
		},

		replaceConnections(state, actions) {
			const connectionsData = actions.payload.data as ConnectionData[]

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
	},
})

export const pointsActions = pointsSlice.actions

export default pointsSlice.reducer
