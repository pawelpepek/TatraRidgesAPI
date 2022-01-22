import { useSelector, useDispatch } from "react-redux"

import { adminModeActions } from "../../store/admin-mode-slice"
import { postConnectionRidge } from "../../store/map-actions"

import StoreType from "../../store/store-types"
import PointsPanel from "./points-panel"

const AdminPanel: React.FC = () => {
	const adminMode = useSelector((state: StoreType) => state.adminMode.value)
	const dispatch = useDispatch()

	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	const clickModeHandler = () => dispatch(adminModeActions.toggle())

	const clickConnectHandler = () =>
		dispatch(postConnectionRidge(pointFrom.id, pointTo.id))

	return (
		<>
			<h2>Panel administratora</h2>
			<PointsPanel deleteVisible={true} />
			<button onClick={clickConnectHandler}>Połacz punkty</button>
			<div></div>
			<button onClick={clickModeHandler}>
				{!adminMode ? "Admin Mode" : "User Mode"}
			</button>
		</>
	)
}

export default AdminPanel
