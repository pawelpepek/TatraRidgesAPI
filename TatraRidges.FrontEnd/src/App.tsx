import "./App.css"
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup
} from "react-leaflet"
import { Point, icon } from "leaflet"
import { useEffect, useState } from "react"

function App() {
	return (
		<MapContainer
			center={[49.179306, 20.088444]}
			zoom={14}
			scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			<Marker position={[49.179306, 20.088444]}>
				<Popup>
					A pretty CSS3 popup. <br /> Easily customizable.
				</Popup>
			</Marker>
		</MapContainer>
	)
}

export default App
