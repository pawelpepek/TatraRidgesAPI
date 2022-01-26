import { useDispatch } from "react-redux"

import { pointsActions } from "../../../store/map-slice"
import reverseIcon from "../../img/arrow-down-back.svg"
import RoundButton from "../../ui/round-button"
import PointsImages from "./points-images"
import PointsLabels from "./points-labels"
import classes from "./points-panel.module.css"

const PointsPanel: React.FC<{ deleteVisible: boolean }> = props => {
	const dispatch = useDispatch()

	const clickSwitchHandler = () =>
		dispatch(pointsActions.toggleSelectedPoints())

	return (
		<div className={classes["main-div"]}>
			<PointsImages />
			<PointsLabels deleteVisible={props.deleteVisible} />
			<div className={classes["button-reverse"]}>
				<RoundButton
					alt='Odróć punkty'
					onClick={clickSwitchHandler}
					imageSrc={reverseIcon}
				/>
			</div>
		</div>
	)
}

export default PointsPanel
