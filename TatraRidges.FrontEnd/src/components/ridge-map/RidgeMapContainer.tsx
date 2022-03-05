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
import React from "react"

const RidgeMapContainer: React.FC<RidgeMapProps> = props => {
	const centerValue = useSelector((state: StoreType) => state.center.value)
	const dispatch = useDispatch()

	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	let map: L.Map

	const [deleting, setDeleting] = useState(false)

	useEffect(() => {
		if (deleting) {
			setDeleting(false)
			dispatch(deletePointById(pointTo.id))
		}
	}, [deleting])

	const fitMap = useCallback(() => {
		const layers: L.Layer[] = []
		if (map !== undefined && map !== null && Object.keys(map).length > 3) {
			map.eachLayer(lr => {
				if (lr.hasOwnProperty("_latlngs")) {
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
		m.createPane("circleMarkerPane")
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
				attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
				url='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
			/>
			<RidgesPointsContainer />
			<RidgesLinesContainer />
		</MapContainer>
	)
}

export default React.memo(RidgeMapContainer)
