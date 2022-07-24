import L, { LeafletEvent, LeafletKeyboardEvent, Map } from "leaflet"
import { useCallback, useEffect, useRef } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { useSelector, useDispatch } from "react-redux"
import { centerActions } from "../../../store/center-slice"
import StoreType from "../../../store/store-types"
import React from "react"
import usePointDelete from "../../../hooks/use-point-delete"
import useMapFit from "../../../hooks/use-map-fit"
import { getMapVersion } from "./MapVersion"

const MountainMap: React.FC = props => {
	const centerValue = useSelector((state: StoreType) => state.center.value)
	const mapVersion = useSelector((state: StoreType) => state.center.mapVersion)

	const dispatch = useDispatch()

	const deletePoint = usePointDelete()

	let map: L.Map

	const ref = useRef(null)

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

	useEffect(() => {
		if (ref.current) {
			const tileLayer: L.TileLayer = ref.current
			tileLayer.setUrl(getMapVersion(mapVersion).url)
		}
	}, [mapVersion])

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
				ref={ref}
				attribution={getMapVersion(mapVersion).attribution}
				url={getMapVersion(mapVersion).url}
			/>
			{props.children}
		</MapContainer>
	)
}

export default MountainMap
