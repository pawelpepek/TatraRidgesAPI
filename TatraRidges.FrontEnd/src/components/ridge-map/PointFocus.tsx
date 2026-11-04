import { useEffect } from "react"
import { useMap } from "react-leaflet"
import { useSelector } from "react-redux"
import StoreType from "../../store/store-types"

const MIN_ZOOM = 14

// Moves the map to a point picked by name (centerActions.requestPointFocus).
const PointFocus: React.FC = () => {
	const map = useMap()
	const focus = useSelector((state: StoreType) => state.center.pointFocus)

	useEffect(() => {
		// A hidden map (the panel on a phone) has nothing to move.
		if (focus.request === 0 || map.getSize().x === 0) {
			return
		}
		const { latitude, longitude } = focus.coordinates
		map.flyTo([latitude, longitude], Math.max(map.getZoom(), MIN_ZOOM), {
			duration: 0.6,
		})
	}, [focus.request])

	return null
}

export default PointFocus
