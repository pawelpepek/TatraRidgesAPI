import { Polyline } from "react-leaflet"
import { Point, icon, latLng } from "leaflet"
import { ConnectionLineProps } from "./types"

const LineConnection: React.FC<ConnectionLineProps> = props => {
console.log(props.point1, props.point2)

	const coordinates = [
		latLng(props.point1.latitude, props.point1.longitude),
		latLng(props.point2.latitude, props.point2.longitude),
	]

	const options = { color: props.color }
	return <Polyline positions={coordinates} pathOptions={options} />
}

export default LineConnection
