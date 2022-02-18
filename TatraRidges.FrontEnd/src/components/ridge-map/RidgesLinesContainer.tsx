import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import LinesContainer from "./basics/LinesContainer"
import { fetchConnectionsData } from "../../store/map-actions"
import StoreType from "../../store/store-types"

const RidgesLinesContainer: React.FC = () => {
	const dispatch = useDispatch()

	let connections = useSelector((state: StoreType) => state.map.connections)

	const pointsOk = useSelector((state: StoreType) => state.map.pointsOk)

	const ridge = useSelector((state: StoreType) => state.map.ridgeInfo)
	const isRouteVisible = useSelector(
		(state: StoreType) => state.ui.isRouteVisible
	)
	
	if (isRouteVisible) {
		const ridges = ridge.ridgesContainer
		const ridgesIds = ridges.map(r => r.pointsConnectionId)

		connections = connections.filter(c => ridgesIds.includes(c.id))
	}

	useEffect(() => {
		dispatch(fetchConnectionsData())
	}, [dispatch, pointsOk])

	return <LinesContainer connections={connections} />
}

export default RidgesLinesContainer
