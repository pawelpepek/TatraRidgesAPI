import { MapContainer, MapContainerProps, Marker, Popup } from "react-leaflet"
import { TileLayer } from "react-leaflet"

import RidgesMarkersContainer from "./RidgesMarkersContainer"
import { RidgeMapProps } from "./basics/types"

const RidgeMapContainer: React.FC<RidgeMapProps> = props => {
	return (
		<MapContainer
			center={[49.179306, 20.088444]}
			zoom={14}
			className={props.className}
			id={props.id}
			scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			<RidgesMarkersContainer/>
		</MapContainer>
	)
}

export default RidgeMapContainer
