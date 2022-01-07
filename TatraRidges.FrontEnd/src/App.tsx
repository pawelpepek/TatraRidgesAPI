import "./App.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Point, icon } from "leaflet"
import { useEffect, useState } from "react"
import RidgeMapContainer from "./components/ridgeMap/RidgeMapContainer"

function App() {
	return <RidgeMapContainer />
}

export default App
