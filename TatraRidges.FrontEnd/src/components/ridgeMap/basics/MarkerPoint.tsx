import { Marker } from "react-leaflet"
import { Point, icon, DragEndEvent } from "leaflet"
import { MountainPoint, LatLongOwner } from "./types"
import passIcon from "../../img/passIcon.svg"
import topIcon from "../../img/topIcon.svg"
import { LeafletEventHandlerFnMap } from "leaflet"
import { RidgesContext } from "../../context/map-context"
import React, { useContext } from "react"

const MarkerPoint: React.FC<MountainPoint> = point => {
	const ridgesContext = useContext(RidgesContext)

	const markerIcon = icon({
		iconUrl: point.pointTypeId === 1 ? topIcon : passIcon,
		iconSize: new Point(16, 16, false),
	})

	return (
		<Marker
			draggable={true}
			key={point.id}
			position={[point.latitude, point.longitude]}
			title={point.name}
			// icon={markerIcon}
			eventHandlers={{
				mousedown: () => {
					ridgesContext.setActualPointId(point.id)
				},
				dragend: e => {
					const eventArgs: DragEndEvent = e
					const target: LatLongOwner = e.target

					const coordinates = {
						latitude: target.getLatLng().lat,
						longitude: target.getLatLng().lng,
					}
					ridgesContext.moveActualPoint(coordinates)
				},
			}}
		/>
	)
}

export default React.memo(MarkerPoint)
