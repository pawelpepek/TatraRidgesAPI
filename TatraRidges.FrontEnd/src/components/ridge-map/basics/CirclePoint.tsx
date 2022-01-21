import { CircleMarker } from "react-leaflet"
import { Point, icon, CircleMarkerOptions } from "leaflet"
import { MountainPoint } from "../../types"
import passIcon from "../../img/passIcon.svg"
import topIcon from "../../img/topIcon.svg"
import React, { useState } from "react"
import MarkerPoint from "./MarkerPoint"
import { useSelector, useDispatch } from "react-redux"
import { pointsActions } from "../../../store/map-slice"
import StoreType from "../../../store/store-types"

const CirlcePoint: React.FC<MountainPoint> = point => {
	const dispatch = useDispatch()

	const adminMode = useSelector((state: StoreType) => state.adminMode.value)

	const [isMarker, setMarker] = useState(false)

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

	if (!adminMode && isMarker) {
		setMarker(false)
	}

	return (
		<>
			<CircleMarker
				center={[point.latitude, point.longitude]}
				pathOptions={options}
				key={point.id}
				eventHandlers={{
					click: () => {
						setActualPoint()
						setMarker(adminMode)
					},
				}}
			/>
			{isMarker && adminMode && (
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
