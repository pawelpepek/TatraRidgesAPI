import MarkersContainer from "./basics/MarkersContainer"
import { useState, useEffect, useCallback } from "react"
import { MountainPoint } from "./basics/types"
import { getPoints } from "./helpers/fetcher"

const RidgesMarkersContainer: React.FC = () => {
	const emptyPoints: MountainPoint[] = []
	const [points, setPoints] = useState(emptyPoints)

	const loadPoints = useCallback(async () => {
		setPoints(await getPoints())
	}, [])

	useEffect(() => {
		loadPoints()
	}, [loadPoints])

	return <MarkersContainer points={points} />
}

export default RidgesMarkersContainer
