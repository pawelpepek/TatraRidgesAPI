import {RidgeWithRoutes} from "../../../store/routeTypes"
import RouteAnyPartPanel from "./RouteAnyPartPanel"
import classes from "./RouteList.module.css"

const RouteList: React.FC<{parts:RidgeWithRoutes[] }> = props=> {


	return (<ul className={classes.list}>
		{props.parts.map(p=><RouteAnyPartPanel ridgeWithRoutes={p} />)}
	</ul>)
}

export default RouteList
