import { useSelector, useDispatch } from "react-redux"

import { deletePointById } from "../../store/map-actions"
import { pointsActions } from "../../store/map-slice"
import StoreType from "../../store/store-types"

const PointsPanel: React.FC<{ deleteVisible: boolean }> = props => {
	const dispatch = useDispatch()
	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	const clickDeleteHandler = () => dispatch(deletePointById(pointTo.id))

	const clickSwitchHandler = () =>
		dispatch(pointsActions.toggleSelectedPoints())

	return (
		<>
			<div>
				<div>
					<p>
						Punkt od {"=>"} {pointFrom.name}
					</p>
				</div>
				<div>
					<p>
						Punkt do {"=>"} {pointTo.name}
					</p>
					<button onClick={clickDeleteHandler}>Usuń punkt</button>
				</div>
			</div>
			<button onClick={clickSwitchHandler}>Odwróć</button>
		</>
	)
}

export default PointsPanel
