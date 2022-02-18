import { RidgeAllInformation } from "../../../store/routeTypes"

import RouteSummaryPanel from "./summary/RouteSummaryPanel"
import RouteList from "./list/RouteList"

const RouteAllInfoPanel: React.FC<{route: RidgeAllInformation}> = props => {
	const isNotEmpty=props.route.initalRouteSummary!==undefined
	return (
		<>
			{isNotEmpty && <RouteSummaryPanel summary={props.route.initalRouteSummary}/>}
			{isNotEmpty && <RouteList parts={props.route.ridgesContainer}/>}
		</>
	)
}

export default RouteAllInfoPanel
