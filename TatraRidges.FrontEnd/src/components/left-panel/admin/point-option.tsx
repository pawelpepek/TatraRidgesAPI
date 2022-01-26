import { useDispatch, useSelector } from "react-redux"

import { movePoint } from "../../../store/map-actions"
import { pointsActions } from "../../../store/map-slice"
import StoreType from "../../../store/store-types"
import { MountainPoint } from "../../types"
import classes from "./point-option.module.css"

const PointOption: React.FC<{ point: MountainPoint }> = props => {
	const dispatch = useDispatch()
	const centerValue = useSelector((state: StoreType) => state.center.value)

	const clickHandler = () => {
		dispatch(movePoint(props.point.id, centerValue.coordinates))
		dispatch(pointsActions.setActualPoint({ point: props.point }))
	}

	return (
		<option className={classes.option} onDoubleClick={clickHandler}>
			{props.point.name}
		</option>
	)
}

export default PointOption
