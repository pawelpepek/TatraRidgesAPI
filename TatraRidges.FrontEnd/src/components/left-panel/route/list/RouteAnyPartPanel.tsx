import { RidgeWithRoutes, Route } from "../../../../store/routeTypes"
import RoutePartPanel from "./RoutePartPanel"
import MountainsPointsConnectionLabel from "../../info/MountainsPointsConnectionLabel"
import RouteEmptyPartPanel from "./RouteEmptyPartPanel"
import RouteVersionsButton from "./RouteVersionsButton"
import LiContainer from "../../../ui/LiContainer"

const RouteAnyPartPanel: React.FC<{
	ridgeWithRoutes: RidgeWithRoutes
}> = props => {
	const routes = props.ridgeWithRoutes.routes

	const getRoute = () => {
		const r = routes.find(r => r.id === props.ridgeWithRoutes.selectedId)
		return r === undefined ? ({} as Route) : r
	}

	const point1 = props.ridgeWithRoutes.point1
	const point2 = props.ridgeWithRoutes.point2
	return (
		<LiContainer>
			{point1 !== undefined && point2 != undefined && (
				<MountainsPointsConnectionLabel point1={point1} point2={point2}>
					{routes !== undefined && routes !== null && routes.length > 1 && (
						<RouteVersionsButton
							routes={routes}
							id={props.ridgeWithRoutes.pointsConnectionId}
						/>
					)}
				</MountainsPointsConnectionLabel>
			)}

			{routes.length > 0 ? (
				<RoutePartPanel route={getRoute()} />
			) : (
				<RouteEmptyPartPanel />
			)}
		</LiContainer>
	)
}

export default RouteAnyPartPanel
