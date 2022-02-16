import Description from "../Description"
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
