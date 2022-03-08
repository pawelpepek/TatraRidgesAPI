import "./App.css"
import RidgeMapContainer from "./components/ridge-map/RidgeMapContainer"
import MainPanel from "./components/left-panel/MainPanel"
import LoadingSpinner from "./components/ui/LoaderSpinner"
import useRouteVisible from "./hooks/use-rote-visible"
import usePending from "./hooks/use-pending"

function App() {
	const pending = usePending()

	const isRoute = useRouteVisible()
	const className = `map ${isRoute ? "hide-map" : ""}`

	return (
		<>
			<div className='body-container'>
				<div className={className}>
					{pending && (
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
