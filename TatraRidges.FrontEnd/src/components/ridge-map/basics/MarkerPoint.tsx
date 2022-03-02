import { Marker } from "react-leaflet"
import { LatLongOwner } from "../../types"
import { useDispatch, useSelector } from "react-redux"
import { movePoint } from "../../../store/map-actions"
import { Coordinates } from "../../types"
import { useEffect, useState } from "react"
import StoreType from "../../../store/store-types"
import { pointsActions } from "../../../store/map-slice"
import { Tooltip } from "react-leaflet"

const MarkerPoint: React.FC<{
	id: number
	latitude: number
	longitude: number
	name: string
	onClick(): void
}> = point => {
	const dispatch = useDispatch()

	const partVisible = useSelector((state: StoreType) => state.ui.visiblePanel)

	const [_, setChangeSwitch] = useState(false)

	useEffect(() => {
		dispatch(pointsActions.clearRidge(null))
	}, [dispatch])

	return (
		<Marker
			position={[point.latitude, point.longitude]}
			draggable={partVisible === "admin"}
			eventHandlers={{
				click: () => {
					point.onClick()
				},
				dragend: async e => {
					const target: LatLongOwner = e.target

					const coordinates: Coordinates = {
						latitude: target.getLatLng().lat,
						longitude: target.getLatLng().lng,
					}
					const ok = await dispatch(movePoint(point.id, coordinates))
					if (!ok) {
						setChangeSwitch(prevState => !prevState)
					}
				},
			}}>
			<Tooltip>{point.name}</Tooltip>
		</Marker>
	)
}

export default MarkerPoint
