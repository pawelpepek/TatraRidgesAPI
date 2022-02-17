import classes from "./RankLabel.module.css"

const RankLabel: React.FC<{ rank: number }> = props => {
	const rank = "" + props.rank

	return (
		<section className={classes.rank}>
			<p>{rank}</p>
		</section>
	)
}

export default RankLabel
