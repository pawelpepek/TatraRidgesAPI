import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSummaryForRoutes } from "../store/map-actions"
import { pointsActions } from "../store/map-slice"
import { RouteIdFrom } from "../store/routeTypes"
import StoreType from "../store/store-types"
import { uiActions } from "../store/ui-slice"

const useRoutePartChange = (id: number) => {
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
				id,
			})
		)
		setChanged(true)
	}
	useEffect(() => {
		if (changed) {
			dispatch(getSummaryForRoutes(routesIds))
			dispatch(uiActions.setRoutePartVisible(-1))
		}
	}, [changed])

	return checkHandler
}

export default useRoutePartChange
