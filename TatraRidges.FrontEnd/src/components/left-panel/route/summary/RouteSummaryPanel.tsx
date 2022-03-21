import { RidgeAllInformation } from "../../../../store/routeTypes"
import FirstInfoLabel from "../../info/FirstInfoLabel"
import SecondInfoLabel from "../../info/SecondInfoLabel"
import MountainsPointsConnectionLabel from "../../info/MountainsPointsConnectionLabel"
import RoundContainer from "../../../ui/RoundContainer"

interface RouteSummaryPanelProps {
	info: RidgeAllInformation
	className: string
}

const RouteSummaryPanel: React.FC<RouteSummaryPanelProps> = props => {
	const summary = props.info.initalRouteSummary

	const point1 = props.info.ridgesContainer[0].point1
	const point2 =
		props.info.ridgesContainer[props.info.ridgesContainer.length - 1].point2

	return (
		<RoundContainer className={props.className}>
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
				directionDescription={
					summary.isConsistentDirection
						? ""
						: "Występują drogi z opisem w odwrotnym kierunku"
				}
				routeTime={summary.routeTime}
			/>
		</RoundContainer>
	)
}

export default RouteSummaryPanel
