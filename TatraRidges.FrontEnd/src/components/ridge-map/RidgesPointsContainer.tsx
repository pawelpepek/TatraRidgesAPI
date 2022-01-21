import PointsContainer from "./basics/PointsContainer"
import { useEffect } from "react"
import { MountainPoint } from "./basics/types"
import { useDispatch, useSelector } from "react-redux"
import { fetchPointsData } from "../../store/map-actions"

const RidgesPointsContainer: React.FC = () => {
	interface MapPoints {
		map: { points: MountainPoint[] }
	}

	const dispatch = useDispatch()

	const points = useSelector((state: MapPoints) => state.map.points)

	useEffect(() => {
		dispatch(fetchPointsData())
	}, [dispatch])
	return <PointsContainer points={points} />
}

export default RidgesPointsContainer
