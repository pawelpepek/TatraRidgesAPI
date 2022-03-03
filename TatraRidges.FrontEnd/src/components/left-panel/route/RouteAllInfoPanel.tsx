import { RidgeAllInformation } from "../../../store/routeTypes"
import RouteSummaryPanel from "./summary/RouteSummaryPanel"
import RouteList from "./list/RouteList"
import Chart from "./Chart"

const RouteAllInfoPanel: React.FC<{ route: RidgeAllInformation }> = props => {
	const isNotEmpty = props.route.initalRouteSummary !== undefined
	// const manyParts =
	// 	isNotEmpty &&
	// 	props.route.ridgesContainer !== undefined &&
	// 	props.route.ridgesContainer.length > 1
	return (
		<>
			{isNotEmpty && <RouteSummaryPanel info={props.route} />}
			{isNotEmpty && <Chart parts={props.route.ridgesContainer} />}
			{isNotEmpty && <RouteList parts={props.route.ridgesContainer} />}
		</>
	)
}

export default RouteAllInfoPanel
