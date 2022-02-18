import RankLabel from "./RankLabel"
import DifficultyLabel from "./DifficultyLabel"
import classes from "./ParametersLabel.module.css"

interface ParametersLabelProps {
	rank: number
	avrDifficulty?: string
	maxDifficulty: string
}

const ParametersLabel: React.FC<ParametersLabelProps> = props => {
	return (
		<div className={classes.numbers}>
			<RankLabel rank={props.rank} />
			<section>
				{props.avrDifficulty !== undefined && (
					<DifficultyLabel text={`${props.avrDifficulty}/`} small={true} />
				)}
				<DifficultyLabel text={props.maxDifficulty} />
			</section>
		</div>
	)
}

export default ParametersLabel
