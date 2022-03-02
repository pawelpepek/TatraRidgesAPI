import { RidgeAllInformation } from "../../../store/routeTypes"
import RouteSummaryPanel from "./summary/RouteSummaryPanel"
import RouteList from "./list/RouteList"

const RouteAllInfoPanel: React.FC<{ route: RidgeAllInformation }> = props => {
	const isNotEmpty = props.route.initalRouteSummary !== undefined
	const manyParts =
		isNotEmpty &&
		props.route.ridgesContainer !== undefined &&
		props.route.ridgesContainer.length > 1
	return (
		<>
			{manyParts && <RouteSummaryPanel info={props.route} />}
			{isNotEmpty && <RouteList parts={props.route.ridgesContainer} />}
		</>
	)
}

export default RouteAllInfoPanel
