import { RidgeAllInformation } from "../../../store/routeTypes"

import RouteSummaryPanel from "./summary/RouteSummaryPanel"
import RouteList from "./list/RouteList"
import MountainsPointsConnectionLabel from "../info/MountainsPointsConnectionLabel"

const RouteAllInfoPanel: React.FC<{ route: RidgeAllInformation }> = props => {
	const isNotEmpty = props.route.initalRouteSummary !== undefined
	const point1 = props.route.ridgesContainer[0].point1
	const point2 =
		props.route.ridgesContainer[props.route.ridgesContainer.length - 1].point2

	return (
		<>
			{isNotEmpty && (
				<>
					{point1 !== undefined && point2 !== undefined && (
						<MountainsPointsConnectionLabel point1={point1} point2={point2} />
					)}

					<RouteSummaryPanel summary={props.route.initalRouteSummary} />
				</>
			)}
			{isNotEmpty && <RouteList parts={props.route.ridgesContainer} />}
		</>
	)
}

export default RouteAllInfoPanel
