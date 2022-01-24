import { Point, icon, CircleMarkerOptions } from "leaflet"
import React from "react"
import { CircleMarker } from "react-leaflet"
import { useSelector, useDispatch } from "react-redux"

import { pointsActions } from "../../../store/map-slice"
import StoreType from "../../../store/store-types"
import passIcon from "../../img/passIcon.svg"
import topIcon from "../../img/topIcon.svg"
import { MountainPoint } from "../../types"
import MarkerPoint from "./MarkerPoint"

const CirlcePoint: React.FC<MountainPoint> = point => {
	const dispatch = useDispatch()

	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)
	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)

	// const [isToolTip, setTooltip] = useState(false)

	const markerIcon = icon({
		iconUrl: point.pointTypeId === 1 ? topIcon : passIcon,
		iconSize: new Point(16, 16, false),
	})

	const options: CircleMarkerOptions = {
		color: point.pointTypeId === 1 ? "red" : "blue",
		radius: 10,
	}

	const setActualPoint = () => dispatch(pointsActions.setActualPoint({ point }))

	return (
		<>
			<CircleMarker
				center={[point.latitude, point.longitude]}
				pathOptions={options}
				key={point.id}
				eventHandlers={{
					click: () => {
						setActualPoint()
					},
				}}
			/>
			{(pointTo.id === point.id || pointFrom.id === point.id) && (
				<MarkerPoint
					id={point.id}
					name={point.name}
					latitude={point.latitude}
					longitude={point.longitude}
					onClick={setActualPoint}
				/>
			)}
		</>
	)
}

export default React.memo(CirlcePoint)
