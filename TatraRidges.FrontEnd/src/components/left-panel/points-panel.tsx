import { useSelector, useDispatch } from "react-redux"

import { deletePointById } from "../../store/map-actions"
import { pointsActions } from "../../store/map-slice"
import StoreType from "../../store/store-types"
import classes from "./points-panel.module.css"
import RoundButton from "../ui/round-button"
import reverseIcon from "../img/arrow-down-back.svg"
import deleteIcon from "../img/trash.svg"
import startIcon from "../img/point.svg"
import endIcon from "../img/mark.svg"
import arrowIcon from "../img/arrow-down.svg"

const PointsPanel: React.FC<{ deleteVisible: boolean }> = props => {
	const dispatch = useDispatch()
	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	const clickDeleteHandler = () => dispatch(deletePointById(pointTo.id))

	const clickSwitchHandler = () =>
		dispatch(pointsActions.toggleSelectedPoints())

	return (
		<div className={classes["main-div"]}>
			<div className={classes["images-div"]}>
				<img className={classes.image} src={startIcon} alt='' />
				<img className={classes.image} src={arrowIcon} alt='' />
				<img className={classes.image} src={endIcon} alt='' />
			</div>
			<div className={classes["points-div"]}>
				<div>
					<div className={classes.point}>
						<p className={classes.info}>{pointFrom.name}</p>
					</div>
				</div>

				<div />
				<div>
					<div className={classes.point}>
						<p className={`${classes.info} ${classes["point-to"]}`}>
							{pointTo.name}
						</p>
						{props.deleteVisible && (
							<RoundButton
								alt='Usuń punkt'
								onClick={clickDeleteHandler}
								imageSrc={deleteIcon}
							/>
						)}
					</div>
				</div>
			</div>
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