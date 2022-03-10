import L, { LeafletEvent, LeafletKeyboardEvent, Map } from "leaflet"
import { useCallback } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { useSelector, useDispatch } from "react-redux"
import { centerActions } from "../../../store/center-slice"
import StoreType from "../../../store/store-types"
import React from "react"
import usePointDelete from "../../../hooks/use-point-delete"
import useMapFit from "../../../hooks/use-map-fit"

const MountainMap: React.FC = props => {
	const centerValue = useSelector((state: StoreType) => state.center.value)
	const dispatch = useDispatch()

	const deletePoint = usePointDelete()

	let map: L.Map

	const fitMap = useMapFit()

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
			deletePoint()
		}
		if (e.originalEvent.key === "z") {
			fitMap(map)
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
			maxZoom={17}
			scrollWheelZoom={true}
			whenCreated={onMapCreated}>
			<TileLayer
				attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
				url='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
			/>
			{props.children}
		</MapContainer>
	)
}

export default MountainMap
