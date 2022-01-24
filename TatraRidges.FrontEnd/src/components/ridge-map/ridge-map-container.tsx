import { LeafletKeyboardEvent, Map } from "leaflet"
import { useState, useCallback, useEffect } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { useSelector, useDispatch } from "react-redux"

import { centerActions } from "../../store/center-slice"
import StoreType from "../../store/store-types"
import { deletePointById } from "../../store/map-actions"
import RidgesLinesContainer from "./RidgesLinesContainer"
import RidgesMarkersContainer from "./RidgesPointsContainer"
import { RidgeMapProps } from "../types"
import classes from "./ridge-map-container"

const RidgeMapContainer: React.FC<RidgeMapProps> = props => {
	const centerValue = useSelector((state: StoreType) => state.center.value)
	const dispatch = useDispatch()

	const pointTo = useSelector((state: StoreType) => state.map.pointTo)
	const [deleting, setDeleting] = useState(false)

	useEffect(() => {
		if (deleting) {
			setDeleting(false)
			// console.log(pointFrom)
			dispatch(deletePointById(pointTo.id))
		}
	}, [deleting])

	let map: Map

	const onChangeMap = useCallback(() => {
		const value = {
			coordinates: {
				latitude: map.getCenter().lat,
				longitude: map.getCenter().lng,
			},
			zoom: map.getZoom(),
		}
		dispatch(centerActions.setValues(value))
		// console.log(value)
	}, [])

	const onKeyDown = useCallback((e: LeafletKeyboardEvent) => {
		if (e.originalEvent.key === "Delete") {
			setDeleting(true)
		}
	}, [])

	const onMapCreated = useCallback((m: Map) => {
		map = m
		map.on("moveend", onChangeMap)
		map.on("zoomend", onChangeMap)
		map.on("keydown", onKeyDown)
	}, [])

	return (
		<MapContainer
			center={[
				centerValue.coordinates.latitude,
				centerValue.coordinates.longitude,
			]}
			zoom={centerValue.zoom}
			className={props.className}
			id={props.id}
			scrollWheelZoom={true}
			whenCreated={onMapCreated}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			<RidgesMarkersContainer />
			<RidgesLinesContainer />
		</MapContainer>
	)
}

export default RidgeMapContainer
