import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getSummaryForRoutes } from "../store/map-actions"
import { pointsActions } from "../store/map-slice"
import { RouteIdFrom } from "../store/routeTypes"
import StoreType from "../store/store-types"
import { uiActions } from "../store/ui-slice"
import useAppDispatch from "./use-app-dispatch"

const useRoutePartChange = (id: number) => {
	const dispatch = useAppDispatch()
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
