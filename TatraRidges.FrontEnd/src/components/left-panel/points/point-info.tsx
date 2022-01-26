import { MountainPoint } from "../../types"
import classes from "./point-info.module.css"

interface PointInfoProps {
	point: MountainPoint
	withButton?: boolean
}

const PointInfo: React.FC<PointInfoProps> = props => {
	let className = classes.info

	if (props.withButton) {
		className += " " + classes["point-with-delete"]
	}
	return (
		<section className={className}>
			<p className={classes.info}>{props.point.name}</p>
			{props.point.id >= 0 && (
				<p className={classes.info}>
					{props.point.evaluation > 0 ? props.point.evaluation : "/nan"} m.n.p.m
				</p>
			)}
		</section>
	)
}

export default PointInfo
