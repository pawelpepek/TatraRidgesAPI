import L from "leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"
import { useSelector } from "react-redux"
import StoreType from "../../store/store-types"

// Fits the map to the shown route when centerActions.requestRouteFit is
// dispatched, e.g. after a search.
const RouteFit: React.FC = () => {
	const map = useMap()
	const request = useSelector(
		(state: StoreType) => state.center.routeFitRequest
	)
	const ridges = useSelector(
		(state: StoreType) => state.map.ridgeInfo.ridgesContainer
	)

	useEffect(() => {
		// A hidden map (the route list on a phone) has no size to fit into.
		if (request === 0 || ridges === undefined || map.getSize().x === 0) {
			return
		}
		const points = ridges
			.flatMap(r => [r.point1, r.point2])
			.filter(p => p !== undefined)
			.map(p => L.latLng(p.latitude, p.longitude))
		if (points.length > 0) {
			map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 })
		}
	}, [request])

	return null
}

export default RouteFit
