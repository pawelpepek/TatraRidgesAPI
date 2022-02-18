import { RouteSummary } from "../../../../store/routeTypes"
import classes from "./RouteSummaryPanel.module.css"
import FirstInfoLabel from "../../info/FirstInfoLabel"
import SecondInfoLabel from "../../info/SecondInfoLabel"

const RouteSummaryPanel: React.FC<{ summary: RouteSummary }> = props => {
	return (
		<div className={classes.container}>
			<FirstInfoLabel
				text1={props.summary.description}
				maxDifficulty={props.summary.maxDifficulty.text}
				avarageDifficulty={props.summary.avarageDifficulty.text}
				rank={props.summary.rank}
			/>
			<SecondInfoLabel
				rappeling={props.summary.rappeling}
				isEmptyRoute={props.summary.isEmptyRoute}
				isConsistentDirection={props.summary.isConsistentDirection}
				routeTime={props.summary.routeTime}
			/>
		</div>
	)
}

export default RouteSummaryPanel
