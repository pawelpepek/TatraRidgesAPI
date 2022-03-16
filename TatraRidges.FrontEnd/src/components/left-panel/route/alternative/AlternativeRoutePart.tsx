import { useDispatch, useSelector } from "react-redux"
import { Route, RouteIdFrom } from "../../../../store/routeTypes"
import { pointsActions } from "../../../../store/map-slice"
import { uiActions } from "../../../../store/ui-slice"
import RoutePartPanel from "../list/RoutePartPanel"
import OptionBox from "../../../ui/OptionBox"
import StoreType from "../../../../store/store-types"
import LiContainer from "../../../ui/LiContainer"
import { getSummaryForRoutes } from "../../../../store/map-actions"
import { useEffect, useState } from "react"

interface AlternativeRoutePartProps {
	route: Route
	checked: boolean
}

const AlternativeRoutePart: React.FC<AlternativeRoutePartProps> = props => {
	const dispatch = useDispatch()
	const visibleRoutePart = useSelector(
		(state: StoreType) => state.ui.selectedRoutePart
	)
	const routesIds: RouteIdFrom[] = useSelector((state: StoreType) =>
		state.map.ridgeInfo.ridgesContainer.map(r => {
			return {
				routeId: r.selectedId,
				pointFrom: r.pointId1,
			}
		})
	)

	const [changed, setChanged] = useState(false)

	const checkHandler = () => {
		dispatch(
			pointsActions.setSelectedRoutePartId({
				connectionId: visibleRoutePart,
				id: props.route.id,
			})
		)
		setChanged(true)
	}
	useEffect(() => {
		console.log(changed)
		if (changed) {
			dispatch(getSummaryForRoutes(routesIds))
			dispatch(uiActions.setRoutePartVisible(-1))
		}
	}, [changed])
	return (
		<LiContainer key={props.route.id}>
			<OptionBox checked={props.checked} onCheck={checkHandler} />
			<RoutePartPanel route={props.route} />
		</LiContainer>
	)
}

export default AlternativeRoutePart
