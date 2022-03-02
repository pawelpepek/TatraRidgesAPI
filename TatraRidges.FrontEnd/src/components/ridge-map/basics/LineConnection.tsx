import { Polyline } from "react-leaflet"
import { latLng} from "leaflet"
import { ConnectionLineProps } from "../../types"

const LineConnection: React.FC<ConnectionLineProps> = props => {
	const coordinates = [
		latLng(props.point1.latitude, props.point1.longitude),
		latLng(props.point2.latitude, props.point2.longitude),
	]

	return (
		<Polyline
			key={`line_${props.id}`}
			positions={coordinates}
		/>
	)
}

export default LineConnection
