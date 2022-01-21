import { MapContainer } from "react-leaflet"
import { TileLayer } from "react-leaflet"
import { latLng, LeafletKeyboardEvent, Map } from "leaflet"
import { useSelector, useDispatch } from "react-redux"

import RidgesMarkersContainer from "./RidgesPointsContainer"
import RidgesLinesContainer from "./RidgesLinesContainer"
import { RidgeMapProps } from "../types"
import { useState, useCallback, useEffect } from "react"
import { deletePointById } from "../../store/map-actions"
import StoreType from "../../store/store-types"

const RidgeMapContainer: React.FC<RidgeMapProps> = props => {
	// const params=useParams<NavigationParams>()
	// console.log(params)

	const dispatch = useDispatch()

	const defaultPosition = latLng(49.219417, 20.009306)
	const defaultZoom = 16

	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)

	const [deleting, setDeleting] = useState(false)

	useEffect(() => {
		if (deleting) {
			setDeleting(false)
			// console.log(pointFrom)
			dispatch(deletePointById(pointFrom.id))
		}
	}, [deleting])

	const [[position, zoom], setPosition] = useState([
		defaultPosition,
		defaultZoom,
	])

	let map: Map

	const onChangeMap = useCallback(() => {
		setPosition([map.getCenter(), map.getZoom()])
		// console.log(position, zoom)
	}, [])

	const onKeyDown = useCallback((e: LeafletKeyboardEvent) => {
		if (e.originalEvent.key === "Delete") {
			setDeleting(true)
		}
	}, [])

	const OnMapCreated = useCallback((m: Map) => {
		map = m
		setPosition([map.getCenter(), map.getZoom()])
		map.on("moveend", onChangeMap)
		map.on("zoomend", onChangeMap)
		// console.log(position)
		// history.replace('/')
		map.on("keydown", onKeyDown)
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
