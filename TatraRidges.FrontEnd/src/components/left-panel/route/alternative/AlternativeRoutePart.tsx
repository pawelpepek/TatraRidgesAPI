import { useDispatch, useSelector } from "react-redux"
import { Route } from "../../../../store/routeTypes"
import { pointsActions } from "../../../../store/map-slice"
import { uiActions } from "../../../../store/ui-slice"
import classes from "./AlternativeRoutePart.module.css"
import RoutePartPanel from "../list/RoutePartPanel"
import OptionBox from "../../../ui/OptionBox"
import StoreType from "../../../../store/store-types"
import LiContainer from "../../../ui/LiContainer"

interface AlternativeRoutePartProps {
	route: Route
	checked: boolean
}

const AlternativeRoutePart: React.FC<AlternativeRoutePartProps> = props => {
	const dispatch = useDispatch()
	const visibleRoutePart = useSelector(
		(state: StoreType) => state.ui.selectedRoutePart
	)

	const checkHandler = () => {
		dispatch(
			pointsActions.setSelectedRoutePartId({
				connectionId: visibleRoutePart,
				id: props.route.id,
			})
		)
		dispatch(uiActions.setRoutePartVisible(-1))
	}
	return (
		<LiContainer key={props.route.id}>
			<OptionBox checked={props.checked} onCheck={checkHandler} />
			<RoutePartPanel route={props.route} />
		</LiContainer>
	)
}

export default AlternativeRoutePart
