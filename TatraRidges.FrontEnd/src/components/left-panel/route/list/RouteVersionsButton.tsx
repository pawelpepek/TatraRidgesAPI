import classes from "./RouteVersionsButton.module.css"
import { Route } from "../../../../store/routeTypes"

const RouteVersionsButton: React.FC<{ routes: Route[] }> = props => {
	const onClick = () => {
		console.log(props.routes.length)
	}

	return (
		<button
			data-tip='Alternatywne warianty do wyboru'
			className={classes.add}
			onClick={onClick}>
			+{props.routes.length}
		</button>
	)
}

export default RouteVersionsButton
