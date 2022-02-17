import classes from "./DifficultyLabel.module.css"

const DifficultyLabel: React.FC<{ text: string; small?: boolean }> = props => {
	const className = props.small ? classes.difficulty : classes["difficulty-max"]

	return <span className={className}>{props.text}</span>
}

export default DifficultyLabel
