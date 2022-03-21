import { RidgeAllInformation } from "../../../store/routeTypes"
import RouteSummaryPanel from "./summary/RouteSummaryPanel"
import RouteList from "./list/RouteList"
import Chart from "./Chart"

interface RouteAllInfoPanelProps {
	route: RidgeAllInformation
	className: string
}

const RouteAllInfoPanel: React.FC<RouteAllInfoPanelProps> = props => {
	const isNotEmpty = props.route.initalRouteSummary !== undefined

	return (
		<>
			{isNotEmpty && (
				<RouteSummaryPanel info={props.route} className={props.className} />
			)}
			{isNotEmpty && (
				<Chart
					parts={props.route.ridgesContainer}
					className={props.className}
				/>
			)}
			{isNotEmpty && (
				<RouteList
					parts={props.route.ridgesContainer}
					className={props.className}
				/>
			)}
		</>
	)
}

export default RouteAllInfoPanel
