import { CircleMarkerOptions, Path } from "leaflet"
import React from "react"
import { CircleMarker } from "react-leaflet"
import { useSelector, useDispatch } from "react-redux"

import { pointsActions } from "../../../store/map-slice"
import StoreType from "../../../store/store-types"
import { MountainPoint } from "../../types"
import MarkerPoint from "./MarkerPoint"
import { Tooltip } from "react-leaflet"

const CirlcePoint: React.FC<MountainPoint> = point => {
	const dispatch = useDispatch()
	
	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)

	// const [isToolTip, setTooltip] = useState(false)

	const options: CircleMarkerOptions = {
		color: point.pointTypeId === 1 ? "red" : "blue",
		radius: 10,
	}

	const setActualPoint = () => {
		if (visiblePanel !== "route") {
			dispatch(pointsActions.setActualPoint({ point }))
		}
	}

	return (
		<CircleMarker
			center={[point.latitude, point.longitude]}
			pathOptions={options}
			key={`point_${point.id}`}
			pane={"circleMarkerPane"}
			eventHandlers={{
				click: () => {
					setActualPoint()
				},
			}}>
			<Tooltip>{point.name}</Tooltip>
		</CircleMarker>
	)
}

export default React.memo(CirlcePoint)
