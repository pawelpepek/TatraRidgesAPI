import { RidgeWithRoutes } from "../../../../store/routeTypes"
import RouteAnyPartPanel from "./RouteAnyPartPanel"
import List from "../../../ui/List"
import classes from "./RouteList.module.css"

const RouteList: React.FC<{ parts: RidgeWithRoutes[] }> = props => {
	return (
		<List className={classes.list}>
			{props.parts.map(p => (
				<RouteAnyPartPanel ridgeWithRoutes={p} key={p.pointsConnectionId} />
			))}
		</List>
	)
}

export default RouteList
