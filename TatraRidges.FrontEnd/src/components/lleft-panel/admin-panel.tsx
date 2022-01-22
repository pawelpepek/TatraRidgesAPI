import { useSelector, useDispatch } from "react-redux"

import { adminModeActions } from "../../store/admin-mode-slice"
import { deletePointById, postConnectionRidge } from "../../store/map-actions"
import { pointsActions } from "../../store/map-slice"
import StoreType from "../../store/store-types"

const AdminPanel: React.FC = () => {
	const adminMode = useSelector((state: StoreType) => state.adminMode.value)
	const dispatch = useDispatch()

	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	const clickModeHandler = () => dispatch(adminModeActions.toggle())

	const clickDeleteHandler = () => dispatch(deletePointById(pointTo.id))

	const clickSwitchHandler = () =>
		dispatch(pointsActions.toggleSelectedPoints())

	const clickConnectHandler = () =>
		dispatch(postConnectionRidge(pointFrom.id, pointTo.id))

	return (
		<>
		<h2>Panel administratora</h2>
			<div>
				<p>
					Punkt od {"=>"} {pointFrom.name}
				</p>
			</div>
			<button onClick={clickSwitchHandler}>Odwróć</button>
			<div>
				<p>
					Punkt do {"=>"} {pointTo.name}
				</p>
			</div>
			<button onClick={clickDeleteHandler}>Usuń punkt</button>
			<div></div>
			<button onClick={clickConnectHandler}>Połacz punkty</button>
			<div></div>
			<button onClick={clickModeHandler}>
				{!adminMode ? "Admin Mode" : "User Mode"}
			</button>
		</>
	)
}

export default AdminPanel
