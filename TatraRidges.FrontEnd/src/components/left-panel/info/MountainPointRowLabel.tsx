import classes from "./MountainPointRowLabel.module.css"
import { MountainPoint } from "../../types"

const MountainPointRowLabel: React.FC<
	React.PropsWithChildren<{
		point: MountainPoint
		className?: string
	}>
> = props => {
	const className = `${classes.p} ${props.className}`

	return (
		<p className={className}>
			<span>{props.point.name}</span>
				{props.children}
			<span data-tooltip-id="tooltip" data-tooltip-content='Wysokość w m.n.p.m.' className={classes.evaluation}>
				{props.point.evaluation}
			</span>
		</p>
	)
}

export default MountainPointRowLabel
