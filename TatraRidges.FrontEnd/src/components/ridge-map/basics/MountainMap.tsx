import L, { LeafletEvent, LeafletKeyboardEvent, Map } from "leaflet"
import { useCallback, useEffect, useRef } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { useSelector } from "react-redux"
import { centerActions } from "../../../store/center-slice"
import StoreType from "../../../store/store-types"
import React from "react"
import usePointDelete from "../../../hooks/use-point-delete"
import useMapFit from "../../../hooks/use-map-fit"
import { getMapVersion } from "./MapVersion"
import useAppDispatch from "../../../hooks/use-app-dispatch"

const MountainMap: React.FC<React.PropsWithChildren> = props => {
	const centerValue = useSelector((state: StoreType) => state.center.value)
	const mapVersion = useSelector((state: StoreType) => state.center.mapVersion)

	const dispatch = useAppDispatch()

	const deletePoint = usePointDelete()

	const tileLayerRef = useRef<L.TileLayer>(null)

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

	// The map is passed to the ref once it exists, before its layers are added,
	// so the pane used by CirclePoint is ready in time.
	const onMapCreated = useCallback((m: Map | null) => {
		if (m === null) {
			return
		}
		const onKeyDown = (e: LeafletKeyboardEvent) => {
			if (e.originalEvent.key === "Delete") {
				deletePoint()
			}
			if (e.originalEvent.key === "z") {
				fitMap(m)
			}
		}
		m.on("moveend", onChangeMap)
		m.on("zoomend", onChangeMap)
		m.on("keydown", onKeyDown)
		if (m.getPane("circleMarkerPane") === undefined) {
			m.createPane("circleMarkerPane")
		}
		return () => {
			m.off("moveend", onChangeMap)
			m.off("zoomend", onChangeMap)
			m.off("keydown", onKeyDown)
		}
	}, [])

	useEffect(() => {
		tileLayerRef.current?.setUrl(getMapVersion(mapVersion).url)
	}, [mapVersion])

	return (
		<MapContainer
			ref={onMapCreated}
			center={[
				centerValue.coordinates.latitude,
				centerValue.coordinates.longitude,
			]}
			zoom={centerValue.zoom}
			maxZoom={17}
			scrollWheelZoom={true}>
			<TileLayer
				ref={tileLayerRef}
				attribution={getMapVersion(mapVersion).attribution}
				url={getMapVersion(mapVersion).url}
			/>
			{props.children}
		</MapContainer>
	)
}

export default MountainMap
