import { Route } from "../../../../store/routeTypes"
import RoutePartPanel from "../list/RoutePartPanel"
import OptionBox from "../../../ui/OptionBox"
import LiContainer from "../../../ui/LiContainer"
import useRoutePartChange from "../../../../hooks/use-route-part-change"

interface AlternativeRoutePartProps {
	route: Route
	checked: boolean
}

const AlternativeRoutePart: React.FC<AlternativeRoutePartProps> = props => {
	const checkHandler = useRoutePartChange(props.route.id)

	return (
		<LiContainer key={props.route.id}>
			<OptionBox checked={props.checked} onCheck={checkHandler} />
			<RoutePartPanel route={props.route} />
		</LiContainer>
	)
}

export default AlternativeRoutePart
