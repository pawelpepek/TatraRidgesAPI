import L from "leaflet"
import { useCallback} from "react"

const useMapFit = () => {
	const fitMap = useCallback((map: L.Map) => {
		const layers: L.Layer[] = []
		if (map !== undefined && map !== null && Object.keys(map).length > 3) {
			map.eachLayer(lr => {
				if (lr.hasOwnProperty("_latlngs")) {
					layers.push(lr)
				}
			})
			if (layers.length > 0) {
				const group = L.featureGroup(layers)
				const bounds = group.getBounds()
				bounds.isValid() && map.fitBounds(bounds)
			}
		}
	}, [])

	return fitMap
}

export default useMapFit