import { CircleMarkerOptions } from "leaflet"
import React from "react"
import { CircleMarker } from "react-leaflet"
import { MountainPoint } from "../../types"
import { Tooltip } from "react-leaflet"
import usePointClick from "../../../hooks/use-point-click"

const CirlcePoint: React.FC<{ point: MountainPoint }> = props => {
	const setClicked = usePointClick(props.point)

	const options: CircleMarkerOptions = {
		color: props.point.pointTypeId === 1 ? "red" : "blue",
		radius: 10,
	}

	return (
		<CircleMarker
			center={[props.point.latitude, props.point.longitude]}
			pathOptions={options}
			key={`point_${props.point.id}`}
			pane={"circleMarkerPane"}
			eventHandlers={{
				click: () => setClicked(),
			}}>
			<Tooltip>{props.point.name}</Tooltip>
		</CircleMarker>
	)
}

export default React.memo(CirlcePoint)
