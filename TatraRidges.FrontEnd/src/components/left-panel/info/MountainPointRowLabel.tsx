import classes from "./MountainPointRowLabel.module.css"
import { MountainPoint } from "../../types"

const MountainPointRowLabel: React.FC<{
	point: MountainPoint
	className?: string
	numberDisplay?: number
}> = props => {
	const className = `${classes.p} ${props.className}`

	return (
		<p className={className}>
			<span>{props.point.name}</span>
			{props.numberDisplay !== undefined && props.numberDisplay > 1 && (
				<button className={classes.add}>+{props.numberDisplay}</button>
			)}
			<span className={classes.evaluation}>{props.point.evaluation}</span>
		</p>
	)
}

export default MountainPointRowLabel
