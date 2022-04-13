import "./App.css"
import RidgeMapContainer from "./components/ridge-map/RidgeMapContainer"
import MainPanel from "./components/left-panel/MainPanel"
import LoadingSpinner from "./components/ui/LoadingSpinner"
import useRouteVisible from "./hooks/use-rote-visible"
import usePending from "./hooks/use-pending"
import Info from "./components/ridge-map/Info"

function App() {
	const [pending, pendingInfo] = usePending()

	const isRoute = useRouteVisible()
	const className = `map ${isRoute ? "hide-map" : ""}`

	const spinnerChildren = pendingInfo ? <Info /> : undefined

	return (
		<div className='body-container'>
			<div className={className}>
				{pending && (
					<div className='centeredSpinner'>
						<LoadingSpinner>{spinnerChildren}</LoadingSpinner>
					</div>
				)}
				<RidgeMapContainer />
			</div>
			<MainPanel />
		</div>
	)
}

export default App
