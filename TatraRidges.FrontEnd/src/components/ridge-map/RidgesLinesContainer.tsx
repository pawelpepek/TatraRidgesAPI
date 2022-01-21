import LinesContainer from "./basics/LinesContainer"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchConnectionsData } from "../../store/map-actions"
import StoreType from "../../store/store-types"

const RidgesLinesContainer: React.FC = () => {
	const dispatch = useDispatch()

	const connections = useSelector(
		(state: StoreType) => state.map.connections
	)

	const pointsOk = useSelector((state: StoreType) => state.map.pointsOk)

	useEffect(() => {
		dispatch(fetchConnectionsData())
	}, [dispatch, pointsOk])

	return <LinesContainer connections={connections} />
}

export default RidgesLinesContainer
