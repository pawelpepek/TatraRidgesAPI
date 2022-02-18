import DescriptionLabel from "./DescriptionLabel"
import classes from "./FirstInfoLabel.module.css"
import ParametersLabel from "./ParametersLabel"

interface FirstInfoLabelProps {
	text1: string
    text2?:string
	maxDifficulty: string
	avarageDifficulty?: string
	rank: number
}

const FirstInfoLabel: React.FC<FirstInfoLabelProps> = props => {
	return (
		<div className={classes.description}>
			<DescriptionLabel text={props.text1} text2={props.text2}/>
			<ParametersLabel
				maxDifficulty={props.maxDifficulty}
				avrDifficulty={props.avarageDifficulty}
				rank={props.rank}
			/>
		</div>
	)
}

export default FirstInfoLabel
