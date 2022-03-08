import classes from "./DifficultyLabel.module.css"

const DifficultyLabel: React.FC<{ text: string; small?: boolean }> = props => {
	const className = `${classes.difficulty} ${
		!props.small && classes["difficulty-max"]
	}`

	const text = (props.small ? "Średni" : "Maksymalny") + " poziom trudności"
	return (
		<>
			<span data-tip={text} className={className}>
				{props.text}
			</span>
		</>
	)
}

export default DifficultyLabel
