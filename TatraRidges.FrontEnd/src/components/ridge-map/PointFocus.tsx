import L from "leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"
import { useSelector } from "react-redux"
import StoreType from "../../store/store-types"

const MIN_ZOOM = 14
const MAX_FIT_ZOOM = 15

// Moves the map to a point picked by name, or to both ends of a link without
// the map view (centerActions.requestPointFocus).
const PointFocus: React.FC = () => {
	const map = useMap()
	const focus = useSelector((state: StoreType) => state.center.pointFocus)

	useEffect(() => {
		// A hidden map (the panel on a phone) has nothing to move.
		if (
			focus.request === 0 ||
			focus.points.length === 0 ||
			map.getSize().x === 0
		) {
			return
		}
		const points = focus.points.map(p => L.latLng(p.latitude, p.longitude))
		if (points.length === 1) {
			map.flyTo(points[0], Math.max(map.getZoom(), MIN_ZOOM), {
				duration: 0.6,
			})
		} else {
			map.fitBounds(L.latLngBounds(points), {
				padding: [40, 40],
				maxZoom: MAX_FIT_ZOOM,
			})
		}
	}, [focus.request])

	return null
}

export default PointFocus
