import { RidgeWithRoutes } from "../../../../store/routeTypes"
import RouteAnyPartPanel from "./RouteAnyPartPanel"
import List from "../../../ui/List"
import classes from "./RouteList.module.css"

interface RouteListProps{
	parts: RidgeWithRoutes[] 
	className:string
}


const RouteList: React.FC<RouteListProps> = props => {
	return (
		<List className={`${classes.list} ${props.className}`}>
			{props.parts.map(p => (
				<RouteAnyPartPanel ridgeWithRoutes={p} key={p.pointsConnectionId} />
			))}
		</List>
	)
}

export default RouteList
