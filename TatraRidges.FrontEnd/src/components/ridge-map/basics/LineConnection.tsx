import { Polyline } from "react-leaflet"
import { latLng } from "leaflet"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { ConnectionLineProps } from "../../types"
import StoreType from "../../../store/store-types"
import { orientedGeometry, roundCorners } from "../../../store/ridge-geometry"

const LineConnection: React.FC<ConnectionLineProps> = props => {
	const geometry = useSelector(
		(state: StoreType) => state.ridgeGeometry.byId[props.id]
	)

	// The ridge's line from the laser scan, or a straight line when there is none (or a point moved)
	const coordinates = useMemo(() => {
		const oriented = orientedGeometry(geometry, props.point1, props.point2)
		if (oriented !== undefined) {
			return roundCorners(oriented.line).map(([lat, lng]) => latLng(lat, lng))
		}
		return [
			latLng(props.point1.latitude, props.point1.longitude),
			latLng(props.point2.latitude, props.point2.longitude),
		]
	}, [geometry, props.point1, props.point2])

	return <Polyline key={`line_${props.id}`} positions={coordinates} />
}

export default LineConnection
