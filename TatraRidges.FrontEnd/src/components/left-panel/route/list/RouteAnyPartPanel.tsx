import { RidgeWithRoutes } from "../../../../store/routeTypes"
import classes from "./RouteAnyPartPanel.module.css"
import RoutePartPanel from "./RoutePartPanel"
import MountainsPointsConnectionLabel from "../../info/MountainsPointsConnectionLabel"
import RouteEmptyPartPanel from "./RouteEmptyPartPanel"

const RouteAnyPartPanel: React.FC<{
	ridgeWithRoutes: RidgeWithRoutes
}> = props => {
	const routes = props.ridgeWithRoutes.routes

	const point1 = props.ridgeWithRoutes.point1
	const point2 = props.ridgeWithRoutes.point2
	return (
		<li
			className={classes.container}
			key={props.ridgeWithRoutes.pointsConnectionId}>
			{point1 !== undefined && point2 != undefined && (
				<MountainsPointsConnectionLabel
					point1={point1}
					point2={point2}
					routesCount={routes.length}
				/>
			)}

			{routes.length > 0 ? (
				<RoutePartPanel route={routes[0]} />
			) : (
				<RouteEmptyPartPanel />
			)}
		</li>
	)
}

export default RouteAnyPartPanel
