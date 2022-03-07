import L from "leaflet"
import markIconEnd from "../../img/marker-end-icon.png"
import markIcon from "../../img/marker-icon.png"

export const getIconProperty = (end: boolean | undefined) => {
	return { icon: icon(end) }
}

export const icon = (end: boolean | undefined) => {
	const iconImage = end !== undefined && end ? markIconEnd : markIcon

	return L.icon({
		iconUrl: iconImage,
		iconSize: [25, 41],
		iconAnchor: [13, 41],
		popupAnchor: [-3, -76],
	})
}
