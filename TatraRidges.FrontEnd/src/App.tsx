import "./App.css"
import RidgeMapContainer from "./components/ridge-map/ridge-map-container"
import MainPanel from "./components/left-panel/main-panel"

function App() {
	return (
		<div className='body-container'>
			<MainPanel />
			<RidgeMapContainer className='map' /> 
		</div>
	)
}

export default App
