import Tooltip from "../../../ui/Tooltip"
import AlternativeRoutesList from "./AlternativeRoutesList"
import { Route } from "../../../../store/routeTypes"
import MountainsPointsConnectionLabel from "../../info/MountainsPointsConnectionLabel"
import { MountainPoint } from "../../../types"

interface AlternativeRoutesTabProps {
	routes: Route[]
	selectedId: number
	point1: MountainPoint
	point2: MountainPoint
}

const AlternativeRoutesTab: React.FC<AlternativeRoutesTabProps> = props => {
	return (
		<>
			<MountainsPointsConnectionLabel
				point1={props.point1}
				point2={props.point2}
			/>
			<AlternativeRoutesList
				routes={props.routes}
				selectedId={props.selectedId}
			/>
			<Tooltip />
		</>
	)
}

export default AlternativeRoutesTab
