import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { fetchPointsData } from "../../store/map-actions"
import StoreType from "../../store/store-types"
import PointsContainer from "./basics/PointsContainer"

const RidgesPointsContainer: React.FC = () => {
	const dispatch = useDispatch()

	const points = useSelector((state: StoreType) => state.map.points)

	useEffect(() => {
		dispatch(fetchPointsData())
	}, [dispatch])
	return <PointsContainer points={points} />
}

export default RidgesPointsContainer
