import { CircleMarkerOptions } from "leaflet"
import React, { useEffect, useState } from "react"
import { CircleMarker } from "react-leaflet"
import { useSelector, useDispatch } from "react-redux"

import { pointsActions } from "../../../store/map-slice"
import StoreType from "../../../store/store-types"
import { MountainPoint } from "../../types"
import { Tooltip } from "react-leaflet"

const CirlcePoint: React.FC<{ point: MountainPoint }> = props => {
	const dispatch = useDispatch()

	const [clicked, setClicked] = useState(false)

	const visiblePanel = useSelector((state: StoreType) =>
		clicked ? state.ui.visiblePanel : ""
	)

	const options: CircleMarkerOptions = {
		color: props.point.pointTypeId === 1 ? "red" : "blue",
		radius: 10,
	}

	const setActualPoint = () => {
		setClicked(true)
	}

	useEffect(() => {
		if (clicked) {
			if (visiblePanel !== "route") {
				dispatch(pointsActions.setActualPoint({ point: props.point }))
			}
			setClicked(false)
		}
	}, [clicked])

	return (
		<CircleMarker
			center={[props.point.latitude, props.point.longitude]}
			pathOptions={options}
			key={`point_${props.point.id}`}
			pane={"circleMarkerPane"}
			eventHandlers={{
				click: () => {
					setActualPoint()
				},
			}}>
			<Tooltip>{props.point.name}</Tooltip>
		</CircleMarker>
	)
}

export default React.memo(CirlcePoint)
