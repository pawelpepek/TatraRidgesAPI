import { Marker } from "react-leaflet"
import { LatLongOwner, MountainPoint } from "../../types"
import { useDispatch, useSelector } from "react-redux"
import { movePoint } from "../../../store/map-actions"
import { Coordinates } from "../../types"
import { useState } from "react"
import StoreType from "../../../store/store-types"
import { pointsActions } from "../../../store/map-slice"
import { Tooltip } from "react-leaflet"
import React from "react"
import { latLng } from "leaflet"
import { getIconProperty } from "./MarkerIcon"

interface MarkerPointProps {
	point: MountainPoint
	end?: boolean
}

const MarkerPoint: React.FC<MarkerPointProps> = props => {
	const point = props.point

	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)
	const dispatch = useDispatch()

	const partVisible = useSelector((state: StoreType) => state.ui.visiblePanel)

	const [_, setChangeSwitch] = useState(false)

	const setActualPoint = () => {
		if (visiblePanel !== "route") {
			dispatch(pointsActions.setActualPoint({ point }))
		}
	}

	return (
		<Marker
			{...getIconProperty(props.end)}
			position={latLng(point.latitude, point.longitude)}
			draggable={partVisible === "admin"}
			eventHandlers={{
				click: () => {
					setActualPoint()
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

export default React.memo(MarkerPoint)
