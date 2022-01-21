import LinesContainer from "./basics/LinesContainer"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchConnectionsData } from "../../store/map-actions"
import { ConnectionPoints } from "./basics/types"

const RidgesLinesContainer: React.FC = () => {
	interface MapConnections {
		map: { connections: ConnectionPoints[]; pointsOk: boolean }
	}

	const dispatch = useDispatch()

	const connections = useSelector(
		(state: MapConnections) => state.map.connections
	)

	const pointsOk = useSelector((state: MapConnections) => state.map.pointsOk)

	useEffect(() => {
		dispatch(fetchConnectionsData())
	}, [dispatch, pointsOk])

	return <LinesContainer connections={connections} />
}

export default RidgesLinesContainer
