import classes from "./TimeLabel.module.css"

const TimeLabel: React.FC<{ routeTime: Date }> = props => {
	const parts = props.routeTime.toString().split(":")
	
	const firstParts=parts[0].split(".")

	const days=firstParts.length>1?parseInt(firstParts[0]):0
	
	const hours = parseInt(firstParts[firstParts.length-1])
	const minutes = parseInt(parts[1])

	const hoursText = hours+days > 0 ? `${hours + 24 * days} godz. ` : ""
	const minutesText = minutes > 0 ? `${minutes} min.` : ""

	return (
		<div className={classes.time}>
			<span
				data-tip={
					"Czas przejścia podany w przewodniku"
				}>{`${hoursText}${minutesText}`}</span>
		</div>
	)
}

export default TimeLabel
