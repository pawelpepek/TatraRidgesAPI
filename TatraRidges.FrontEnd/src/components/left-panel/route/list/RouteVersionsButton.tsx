import classes from "./RouteVersionsButton.module.css"
import { Route } from "../../../../store/routeTypes"
import { uiActions } from "../../../../store/ui-slice"
import useAppDispatch from "../../../../hooks/use-app-dispatch"
const RouteVersionsButton: React.FC<{ routes: Route[], id:number}> = props => {
	const dispatch=useAppDispatch()

	const onClick = () => {
		dispatch(uiActions.setRoutePartVisible(props.id))
	}

	return (
		<button
			data-tooltip-id="tooltip" data-tooltip-content='Alternatywne warianty do wyboru'
			className={classes.add}
			onClick={onClick}>
			+{props.routes.length-1}
		</button>
	)
}

export default RouteVersionsButton
