import classes from "./TimeLabel.module.css"

const TimeLabel: React.FC<{ routeTime: Date }> = props => {
	const parts = props.routeTime.toString().split(":")

	const hours = parseInt(parts[0])
	const minutes = parseInt(parts[1])

	const hoursText = hours > 0 ? `${hours} godz. ` : ""
	const minutesText = minutes > 0 ? `${minutes} min.` : ""

	return (
		<div className={classes.time}>
			<span data-tip={"Czas przejścia podany w przewodniku"}>{`${hoursText}${minutesText}`}</span>
		</div>
	)
}

export default TimeLabel
