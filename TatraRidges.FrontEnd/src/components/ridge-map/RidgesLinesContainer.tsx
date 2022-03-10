import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import LinesContainer from "./basics/LinesContainer"
import { fetchConnectionsData } from "../../store/map-actions"
import StoreType from "../../store/store-types"
import useRouteVisible from "../../hooks/use-rote-visible"
import useAdminVisible from "../../hooks/use-admin-visible"

const RidgesLinesContainer: React.FC = () => {
	const dispatch = useDispatch()

	const connections = useSelector((state: StoreType) => state.map.connections)
	const pointsOk = useSelector((state: StoreType) => state.map.pointsOk)
	const ridge = useSelector((state: StoreType) => state.map.ridgeInfo)
	const isAdminVisible = useAdminVisible()
	const isRouteVisible = useRouteVisible()

	let cons=connections

	if (isRouteVisible) {
		const ridges = ridge.ridgesContainer
		const ridgesIds = ridges.map(r => r.pointsConnectionId)

		cons = connections.filter(c => ridgesIds.includes(c.id))
	}

	useEffect(() => {
		dispatch(fetchConnectionsData())
	}, [dispatch, pointsOk])

	return (
		<>
			{(isRouteVisible || isAdminVisible) && (
				<LinesContainer connections={cons} />
			)}
		</>
	)
}

export default RidgesLinesContainer
