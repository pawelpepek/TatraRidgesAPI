import L from "leaflet"
import { Marker } from "react-leaflet"

import { LatLongOwner } from "../../types"
import { useDispatch } from "react-redux"
import { movePoint } from "../../../store/map-actions"
import { Coordinates } from "../../types"
const MarkerPoint: React.FC<{
	id: number
	latitude: number
	longitude: number
	name: string
	onClick(): void
}> = point => {
	const dispatch = useDispatch()

	return (
		<Marker
			position={[point.latitude, point.longitude]}
			title={point.name}
			draggable={true}
			eventHandlers={{
				click: () => {
					point.onClick()
				},
				dragend: e => {
					const target: LatLongOwner = e.target

					const coordinates: Coordinates = {
						latitude: target.getLatLng().lat,
						longitude: target.getLatLng().lng,
					}
					dispatch(movePoint(point.id, coordinates))
				},
			}}
		/>
	)
}

export default MarkerPoint
