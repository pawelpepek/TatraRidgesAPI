import { Marker } from "react-leaflet"
import { MountainPoint } from "../../types"
import { Tooltip } from "react-leaflet"
import React from "react"
import { latLng } from "leaflet"
import { getIconProperty } from "./MarkerIcon"
import usePointDrag from "../../../hooks/use-point-drag"

interface MarkerPointProps {
	point: MountainPoint
	end?: boolean
}

const MarkerPoint: React.FC<MarkerPointProps> = props => {
	const point = props.point

	const { draggable, dragend } = usePointDrag(point)

	return (
		<Marker
			{...getIconProperty(props.end)}
			position={latLng(point.latitude, point.longitude)}
			draggable={draggable}
			eventHandlers={{ dragend }}>
			<Tooltip>{point.name}</Tooltip>
		</Marker>
	)
}

export default React.memo(MarkerPoint)
