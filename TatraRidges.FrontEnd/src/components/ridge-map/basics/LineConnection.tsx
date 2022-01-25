import { Polyline } from "react-leaflet"
import { latLng, Path } from "leaflet"
import { ConnectionLineProps } from "../../types"

const LineConnection: React.FC<ConnectionLineProps> = props => {
	const coordinates = [
		latLng(props.point1.latitude, props.point1.longitude),
		latLng(props.point2.latitude, props.point2.longitude),
	]

	// const options = { color: props.color }

	return (
		<Polyline
			key={`line_${props.id}`}
			positions={coordinates}
			eventHandlers={{
				mouseover: e => {
					;(e.target as Path).bringToBack()
				},
			}}
		/>
	)
}

export default LineConnection
