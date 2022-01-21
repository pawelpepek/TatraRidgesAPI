import { useSelector, useDispatch } from "react-redux"
import { adminModeActions } from "../../store/admin-mode-slice"
import { pointsActions } from "../../store/map-slice"
import { MountainPoint } from "../ridgeMap/basics/types"
import {
	deletePointById,
	postConnectionRidge,
} from "../../store/map-actions"

interface Store {
	adminMode: { value: boolean }
	map: { pointFrom: MountainPoint; pointTo: MountainPoint }
}

const PointsPanel: React.FC = () => {
	const adminMode = useSelector((state: Store) => state.adminMode.value)
	const dispatch = useDispatch()

	const pointFrom = useSelector((state: Store) => state.map.pointFrom)
	const pointTo = useSelector((state: Store) => state.map.pointTo)

	const clickModeHandler = () => dispatch(adminModeActions.toggle())

	const clickDeleteHandler = () => dispatch(deletePointById(pointFrom.id))

	const clickSwitchHandler = () =>
		dispatch(pointsActions.toggleSelectedPoints())

	const clickConnectHandler = () =>
		dispatch(postConnectionRidge(pointFrom.id, pointTo.id))

	return (
		<>
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

export default PointsPanel
