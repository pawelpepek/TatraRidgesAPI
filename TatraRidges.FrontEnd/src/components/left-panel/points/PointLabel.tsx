import { useDispatch } from "react-redux"

import { deletePointById } from "../../../store/map-actions"
import deleteIcon from "../../img/trash.svg"
import { MountainPoint } from "../../types"
import RoundButton from "../../ui/RoundButton"
import classes from "./PointLabel.module.css"
import PointInfo from "./PointInfo"

export interface PointLabelProps {
	deleteVisible?: boolean
	point: MountainPoint
}

const PointLabel: React.FC<PointLabelProps> = props => {
	const dispatch = useDispatch()

	const clickDeleteHandler = () => dispatch(deletePointById(props.point.id))

	return (
		<div className={classes.point}>
			<PointInfo withButton={props.deleteVisible} point={props.point}/>
			{props.deleteVisible && (
				<RoundButton
					className={classes.delete}
					alt='Usuń punkt'
					onClick={clickDeleteHandler}
					imageSrc={deleteIcon}
				/>
			)}
		</div>
	)
}

export default PointLabel
