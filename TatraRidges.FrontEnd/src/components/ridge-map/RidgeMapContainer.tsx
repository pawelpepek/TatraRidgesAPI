import L, { LeafletEvent, LeafletKeyboardEvent, Map } from "leaflet"
import { useState, useCallback, useEffect } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { useSelector, useDispatch } from "react-redux"

import { centerActions } from "../../store/center-slice"
import StoreType from "../../store/store-types"
import { deletePointById } from "../../store/map-actions"
import RidgesLinesContainer from "./RidgesLinesContainer"
import RidgesPointsContainer from "./RidgesPointsContainer"
import { RidgeMapProps } from "../types"

const RidgeMapContainer: React.FC<RidgeMapProps> = props => {
	const centerValue = useSelector((state: StoreType) => state.center.value)
	const dispatch = useDispatch()

	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	let map: L.Map

	const [deleting, setDeleting] = useState(false)

	useEffect(() => {
		if (deleting) {
			setDeleting(false)
			// console.log(pointFrom)
			dispatch(deletePointById(pointTo.id))
		}
	}, [deleting])

	const fitMap = useCallback(() => {
		const layers: L.Layer[] = []
		if (map !== undefined && map !== null && Object.keys(map).length > 3) {
			// console.log(map)
			map.eachLayer(lr => {
				// console.log(lr)
				if (lr.hasOwnProperty("_latlngs")) {
					// console.log(lr)
					layers.push(lr)
				}
			})
			if (layers.length > 0) {
				const group = L.featureGroup(layers)
				// console.log(group)
				const bounds = group.getBounds()
				bounds.isValid() && map.fitBounds(bounds)
			}
		}
	}, [])

	const onChangeMap = useCallback((e: LeafletEvent) => {
		const m = e.target as Map
		const value = {
			coordinates: {
				latitude: m.getCenter().lat,
				longitude: m.getCenter().lng,
			},
			zoom: m.getZoom(),
		}
		dispatch(centerActions.setValues(value))
	}, [])

	const onKeyDown = useCallback((e: LeafletKeyboardEvent) => {
		if (e.originalEvent.key === "Delete") {
			setDeleting(true)
		}
		if (e.originalEvent.key === "z") {
			fitMap()
		}
	}, [])

	const onMapCreated = useCallback((m: Map) => {
		map = m
		m.on("moveend", onChangeMap)
		m.on("zoomend", onChangeMap)
		m.on("keydown", onKeyDown)
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
			<RidgesPointsContainer />
			<RidgesLinesContainer />
		</MapContainer>
	)
}

export default RidgeMapContainer
