import classes from "./MountainsPointsConnectionLabel.module.css"
import { MountainPoint } from "../../types"
import MountainPointRowLabel from "./MountainPointRowLabel"

const MountainsPointsConnectionLabel: React.FC<{
	point1: MountainPoint
	point2: MountainPoint
}> = props => {
	return (
		<>
			<MountainPointRowLabel
				point={props.point1}
				children={props.children}
			/>
			<MountainPointRowLabel point={props.point2} className={classes.p2} />
		</>
	)
}

export default MountainsPointsConnectionLabel
