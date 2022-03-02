import "./App.css"
import RidgeMapContainer from "./components/ridge-map/RidgeMapContainer"
import MainPanel from "./components/left-panel/MainPanel"
import { useSelector } from "react-redux"
import StoreType from "./store/store-types"

function App() {
	const isRoute = useSelector((state: StoreType) => state.ui.isRouteVisible)
	const className = `map ${isRoute ? "hide-map" : ""}`

	return (
		<div className='body-container'>
			<div className={className}>
				<RidgeMapContainer />
			</div>
			<MainPanel />
		</div>
	)
}

export default App
