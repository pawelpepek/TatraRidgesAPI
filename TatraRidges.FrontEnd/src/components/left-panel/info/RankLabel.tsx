import classes from "./RankLabel.module.css"

const RankLabel: React.FC<{ rank: number }> = props => {
	const rank = "" + props.rank

	const rangeFromNumber = (value: number) => {
		const maxRank = 15
		var range = Math.min(value, maxRank)
		return Math.round((255 * (maxRank - range)) / maxRank)
	}

	const redValue = props.rank <= 0 ? 255 : rangeFromNumber(props.rank)
	const greenValue = props.rank >= 0 ? 255 : rangeFromNumber(-props.rank)
	const blueValue = rangeFromNumber(Math.abs(props.rank))

	const backgroundColor = `rgb(${redValue},${greenValue},${blueValue})`
	const sectionStyle = { backgroundColor: backgroundColor }

	return (
		<section data-tip={"Ranking drogi"} className={classes.rank} style={sectionStyle}>
			<p>{rank}</p>
		</section>
	)
}

export default RankLabel
