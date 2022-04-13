import { useSelector } from "react-redux"
import { MountainPoint } from "../components/types"
import { fetchPointsData } from "../store/map-actions"
import { RidgeWithRoutes } from "../store/routeTypes"
import StoreType from "../store/store-types"
import useFetcher from "./use-fetcher"
import useRouteData from "./use-route-data"

const usePointsGet = () => {
	let points = useSelector((state: StoreType) => state.map.points)

	const routeMethod = (ridges: RidgeWithRoutes[]) => {
		const pointsIds = ridges.map(r => r.pointId1)
		pointsIds.push(ridges[ridges.length - 1].pointId2)

		return points.filter(p => pointsIds.includes(p.id))
	}

	const displayingPoints = useRouteData<MountainPoint>({
		defaultValues: points,
		routeMethod,
	})

	useFetcher({
		fetchingMethod: fetchPointsData,
		dependiences: [],
	})

	return displayingPoints
}

export default usePointsGet
