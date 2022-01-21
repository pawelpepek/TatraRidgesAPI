import { MapContainer, Polyline } from "react-leaflet"
import { TileLayer } from "react-leaflet"
import { latLng, Map } from "leaflet"

import RidgesMarkersContainer from "./RidgesPointsContainer"
import RidgesLinesContainer from "./RidgesLinesContainer"
import { RidgeMapProps } from "./basics/types"
import { useState, useCallback } from "react"

const RidgeMapContainer: React.FC<RidgeMapProps> = props => {
	// const params=useParams<NavigationParams>()
	// console.log(params)
	const defaultPosition = latLng(49.219417, 20.009306)
	const defaultZoom = 16

	const [[position, zoom], setPosition] = useState([
		defaultPosition,
		defaultZoom,
	])

	let map: Map

	const onChangeMap = useCallback(() => {
		setPosition([map.getCenter(), map.getZoom()])
		// console.log(position, zoom)
	}, [])

	const OnMapCreated = useCallback((m: Map) => {
		map = m
		setPosition([map.getCenter(), map.getZoom()])
		map.on("moveend", onChangeMap)
		map.on("zoomend", onChangeMap)
		// console.log(position)
		// history.replace('/')
	}, [])

	const nP = { ...defaultPosition }
	nP.lat += 0.01
	nP.lng += 0.01

	return (
		<MapContainer
			center={defaultPosition}
			zoom={defaultZoom}
			className={props.className}
			id={props.id}
			scrollWheelZoom={true}
			whenCreated={OnMapCreated}>
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
