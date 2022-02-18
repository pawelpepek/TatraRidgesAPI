import { RidgeAllInformation } from "../../../../store/routeTypes"
import classes from "./RouteSummaryPanel.module.css"
import FirstInfoLabel from "../../info/FirstInfoLabel"
import SecondInfoLabel from "../../info/SecondInfoLabel"
import MountainsPointsConnectionLabel from "../../info/MountainsPointsConnectionLabel"

const RouteSummaryPanel: React.FC<{ info: RidgeAllInformation }> = props => {
	const summary = props.info.initalRouteSummary

	const point1 = props.info.ridgesContainer[0].point1
	const point2 =
		props.info.ridgesContainer[props.info.ridgesContainer.length - 1].point2

	return (
		<div className={classes.container}>
			{point1 !== undefined && point2 !== undefined && (
				<MountainsPointsConnectionLabel point1={point1} point2={point2} />
			)}

			<FirstInfoLabel
				text1={summary.description}
				maxDifficulty={summary.maxDifficulty.text}
				avarageDifficulty={summary.avarageDifficulty.text}
				rank={summary.rank}
			/>
			<SecondInfoLabel
				rappeling={summary.rappeling}
				isEmptyRoute={summary.isEmptyRoute}
				isConsistentDirection={summary.isConsistentDirection}
				routeTime={summary.routeTime}
			/>
		</div>
	)
}

export default RouteSummaryPanel
