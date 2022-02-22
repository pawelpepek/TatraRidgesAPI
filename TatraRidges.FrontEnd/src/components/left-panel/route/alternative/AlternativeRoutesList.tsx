import { Route } from "../../../../store/routeTypes"
import AlternativeRoutePanel from "./AlternativeRoutePart"
import List from "../../../ui/List"

const AlternativeRoutesList: React.FC<{
	routes: Route[]
	selectedId: number
}> = props => {
	return (
		<List>
			{props.routes.map(r => (
				<AlternativeRoutePanel
					route={r}
					checked={r.id === props.selectedId}
					key={r.id}
				/>
			))}
		</List>
	)
}

export default AlternativeRoutesList
