import { useDispatch } from "react-redux"
import { pointsActions } from "../../../store/map-slice"
import reverseIcon from "../../img/arrow-down-back.svg"
import RoundButton from "../../ui/RoundButton"
import PointsImages from "./PointsImages"
import PointsLabels from "./PointsLabels"
import classes from "./PointsPanel.module.css"

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
					alt='Odwróć punkty'
					onClick={clickSwitchHandler}
					imageSrc={reverseIcon}
				/>
			</div>
		</div>
	)
}

export default PointsPanel
