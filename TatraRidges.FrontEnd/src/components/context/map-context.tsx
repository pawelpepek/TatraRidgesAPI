import React, { useState, useCallback, useEffect } from "react"
import { RidgesData } from "../ridgeMap/basics/types"
import { MountainPoint } from "../ridgeMap/basics/types"
import { getPoints,deletePointById } from "../ridgeMap/helpers/fetcher"

const emptyPoints: MountainPoint[] = []

const emptyRidges = {
	actualPointId: -1,
	lastPointId: -1,
	points:emptyPoints,
	setActualPointId: (id: number) => {},
	switchPoints: () => {},
	deleteActualPoint: () => {},
}

export const RidgesContext = React.createContext(emptyRidges)

const RidgesContextProvider: React.FC = props => {
	const [points, setPoints] = useState(emptyPoints)
	const [pointId, setPointId] = useState(emptyRidges.actualPointId)
	const [lastPointId, setLastPointId] = useState(emptyRidges.lastPointId)

	const loadPoints = useCallback(async () => {
		setPoints(await getPoints())
	}, [])

	const setActualPointId = (id: number) => {
		setLastPointId(pointId)
		setPointId(id)
	}

	const switchPoints = () => {
		const tempPointId = pointId
		setPointId(lastPointId)
		setLastPointId(tempPointId)
	}

	const deletePoint = (id: number) => {
		deletePointById(id)

		const newPoints = [...points]
		const pointToDelete = newPoints.find(p => p.id === id)
		if (pointToDelete !== undefined) {
			const index = newPoints.indexOf(pointToDelete)

			newPoints.splice(index, 1)
			setPoints(newPoints)
		}
	}

	const deleteActualPoint=()=>{
		deletePoint(pointId)
		setActualPointId(lastPointId)
		setLastPointId(-1)
	}
	useEffect(() => {
		loadPoints()
	}, [loadPoints])

	return (
		<RidgesContext.Provider
			value={{
				actualPointId: pointId,
				lastPointId,
				points,
				setActualPointId,
				switchPoints,
				deleteActualPoint,
			}}>
			{props.children}
		</RidgesContext.Provider>
	)
}

export default RidgesContextProvider
