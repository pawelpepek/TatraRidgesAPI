import classes from "./Tooltip.module.css"

const Tooltip: React.FC<{ text: string; className: string }> = props => {
	const className = `${classes.tooltip} ${props.className}`

	return (
		<div className={className}>
			<span>{props.text}</span>
		</div>
	)
}

export default Tooltip
