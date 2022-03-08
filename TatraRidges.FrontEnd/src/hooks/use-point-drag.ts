import { DragEndEvent } from "leaflet"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Coordinates, LatLongOwner, MountainPoint } from "../components/types"
import { movePoint } from "../store/map-actions"
import StoreType from "../store/store-types"

const usePointDrag = (point: MountainPoint) => {
	const dispatch = useDispatch()

	const draggable = useSelector(
		(state: StoreType) => state.ui.visiblePanel === "admin"
	)

	const [_, setChangeSwitch] = useState(false)

	const dragend = async (e: DragEndEvent) => {
		const target: LatLongOwner = e.target

		const coordinates: Coordinates = {
			latitude: target.getLatLng().lat,
			longitude: target.getLatLng().lng,
		}

		if (!await dispatch(movePoint(point.id, coordinates))) {
			setChangeSwitch(prevState => !prevState)
		}
	}

	return { draggable, dragend }
}

export default usePointDrag
