import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { fetchPointsData } from "../../store/map-actions"
import StoreType from "../../store/store-types"
import useRouteVisible from "../../hooks/use-rote-visible"
import PointsContainer from "./basics/PointsContainer"

const RidgesPointsContainer: React.FC = () => {
	const dispatch = useDispatch()

	let points = useSelector((state: StoreType) => state.map.points)
	const ridge = useSelector((state: StoreType) => state.map.ridgeInfo)
	const isRouteVisible = useRouteVisible()

	if (isRouteVisible) {
		const ridges = ridge.ridgesContainer
		const pointsIds = ridges.map(r => r.pointId1)
		pointsIds.push(ridges[ridges.length - 1].pointId2)

		points = points.filter(p => pointsIds.includes(p.id))
	}

	useEffect(() => {
		dispatch(fetchPointsData())
	}, [dispatch])
	return <PointsContainer points={points} />
}

export default RidgesPointsContainer
