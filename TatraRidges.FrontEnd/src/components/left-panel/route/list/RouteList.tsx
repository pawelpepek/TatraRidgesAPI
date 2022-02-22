import { RidgeWithRoutes } from "../../../../store/routeTypes"
import RouteAnyPartPanel from "./RouteAnyPartPanel"
import List from "../../../ui/List"

const RouteList: React.FC<{ parts: RidgeWithRoutes[] }> = props => {
	return (
		<List>
			{props.parts.map(p => (
				<RouteAnyPartPanel ridgeWithRoutes={p} key={p.pointsConnectionId} />
			))}
		</List>
	)
}

export default RouteList
