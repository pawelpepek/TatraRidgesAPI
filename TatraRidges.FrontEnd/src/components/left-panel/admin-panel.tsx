import { useSelector, useDispatch } from "react-redux"

import { postConnectionRidge } from "../../store/map-actions"

import StoreType from "../../store/store-types"
import PointsPanel from "./points-panel"
import NoLocationMarks from "./no-location-marks"

const AdminPanel: React.FC = () => {
	const dispatch = useDispatch()

	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	const clickConnectHandler = () =>
		dispatch(postConnectionRidge(pointFrom.id, pointTo.id))

	return (
		<>
			<h2>Panel administratora</h2>
			<PointsPanel deleteVisible={true} />
			<button onClick={clickConnectHandler}>Połacz punkty</button>
			<NoLocationMarks/>
		</>
	)
}

export default AdminPanel
