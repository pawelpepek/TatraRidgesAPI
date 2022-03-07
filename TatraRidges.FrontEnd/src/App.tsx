import "./App.css"
import RidgeMapContainer from "./components/ridge-map/RidgeMapContainer"
import MainPanel from "./components/left-panel/MainPanel"
import { useSelector } from "react-redux"
import StoreType from "./store/store-types"
import LoadingSpinner from "./components/ui/LoaderSpinner"
import useRouteVisible from "./store/use-rote-visible"

function App() {
	const status = useSelector((state: StoreType) => state.ui.notification.status)
	const isRoute = useRouteVisible()
	const className = `map ${isRoute ? "hide-map" : ""}`

	return (
		<>
			<div className='body-container'>
				<div className={className}>
					{status === "pending" && (
						<div className='centeredSpinner'>
							<LoadingSpinner />
						</div>
					)}
					<RidgeMapContainer />
				</div>
				<MainPanel />
			</div>
		</>
	)
}

export default App
