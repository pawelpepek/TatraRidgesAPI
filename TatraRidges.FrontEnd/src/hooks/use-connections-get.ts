import { useSelector } from "react-redux"
import { ConnectionPoints } from "../components/types"
import { fetchConnectionsData } from "../store/map-actions"
import { RidgeWithRoutes } from "../store/routeTypes"
import StoreType from "../store/store-types"
import useFetcher from "./use-fetcher"
import useRouteData from "./use-route-data"

const useConnectionsGet = () => {
	const connections = useSelector((state: StoreType) => state.map.connections)
	const pointsOk = useSelector((state: StoreType) => state.map.pointsOk)

	const routeMethod = (ridges: RidgeWithRoutes[]) => {
		const ridgesIds = ridges.map(r => r.pointsConnectionId)

		return connections.filter(c => ridgesIds.includes(c.id))
	}

	const displayedConnections = useRouteData<ConnectionPoints>({
		defaultValues: connections,
		routeMethod,
	})

	useFetcher({
		fetchingMethod: fetchConnectionsData,
		dependiences: [pointsOk],
	})

	return displayedConnections
}

export default useConnectionsGet
