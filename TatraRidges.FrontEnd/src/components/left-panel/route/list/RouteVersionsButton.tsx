import { useDispatch } from "react-redux"
import classes from "./RouteVersionsButton.module.css"
import { Route } from "../../../../store/routeTypes"
import { uiActions } from "../../../../store/ui-slice"
const RouteVersionsButton: React.FC<{ routes: Route[], id:number}> = props => {
	const dispatch=useDispatch()

	const onClick = () => {
		dispatch(uiActions.setRoutePartVisible(props.id))
	}

	return (
		<button
			data-tip='Alternatywne warianty do wyboru'
			className={classes.add}
			onClick={onClick}>
			+{props.routes.length-1}
		</button>
	)
}

export default RouteVersionsButton
