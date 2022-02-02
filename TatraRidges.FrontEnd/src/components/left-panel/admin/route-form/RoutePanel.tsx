import Description from "../description"
import classes from "./RoutePanel.module.css"
import RouteForm from "./RouteForm"

const RoutePanel: React.FC<{ className?: string }> = props => {
	return (
		<div className={props.className}>
			<Description text='Dodawanie drogi' />
			<RouteForm />
		</div>
	)
}

export default RoutePanel
