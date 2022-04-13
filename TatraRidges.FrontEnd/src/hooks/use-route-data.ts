import { useDispatch, useSelector } from "react-redux"
import { RidgeWithRoutes } from "../store/routeTypes"
import StoreType from "../store/store-types"
import useRouteVisible from "./use-rote-visible"

const useRouteData = <T>(props: {
	defaultValues: T[]
	routeMethod: (ridges: RidgeWithRoutes[]) => T[]
}) => {
	const ridge = useSelector((state: StoreType) => state.map.ridgeInfo)
	const isRouteVisible = useRouteVisible()

	let result = props.defaultValues

	if (isRouteVisible) {
		const ridges = ridge.ridgesContainer
		result = props.routeMethod(ridges)
	}

	return result
}

export default useRouteData
