import classes from "./MountainsPointsConnectionLabel.module.css"
import { MountainPoint } from "../../types"
import MountainPointRowLabel from "./MountainPointRowLabel"

const MountainsPointsConnectionLabel: React.FC<{
	point1: MountainPoint
	point2: MountainPoint
	routesCount?: number
}> = props => {
	return (
		<>
			<MountainPointRowLabel
				point={props.point1}
				numberDisplay={props.routesCount}
			/>
			<MountainPointRowLabel point={props.point2} className={classes.p2} />
		</>
	)
}

export default MountainsPointsConnectionLabel
