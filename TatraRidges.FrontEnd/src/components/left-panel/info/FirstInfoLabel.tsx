import { RouteType } from "../../../store/routeTypes"
import DescriptionLabel from "./DescriptionLabel"
import classes from "./FirstInfoLabel.module.css"
import ParametersLabel from "./ParametersLabel"
import RouteTypeLabel from "./RouteTypeLabel"

interface FirstInfoLabelProps {
	text1: string
	text2?: string
	maxDifficulty: string
	avarageDifficulty?: string
	rank: number
	routeType?: RouteType
}

const FirstInfoLabel: React.FC<FirstInfoLabelProps> = props => {
	return (
		<div className={classes.description}>
			<DescriptionLabel text={props.text1} text2={props.text2} />
			{props.routeType !== undefined && (
				<RouteTypeLabel routeType={props.routeType} />
			)}
			<ParametersLabel
				maxDifficulty={props.maxDifficulty}
				avrDifficulty={props.avarageDifficulty}
				rank={props.rank}
			/>
		</div>
	)
}

export default FirstInfoLabel
