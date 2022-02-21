import classes from "./MountainPointRowLabel.module.css"
import { MountainPoint } from "../../types"

const MountainPointRowLabel: React.FC<{
	point: MountainPoint
	className?: string
}> = props => {
	const className = `${classes.p} ${props.className}`

	return (
		<p className={className}>
			<span>{props.point.name}</span>
				{props.children}
			<span data-tip='Wysokość w m.n.p.m.' className={classes.evaluation}>
				{props.point.evaluation}
			</span>
		</p>
	)
}

export default MountainPointRowLabel
