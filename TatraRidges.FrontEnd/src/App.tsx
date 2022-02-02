import "./App.css"
import RidgeMapContainer from "./components/ridge-map/RidgeMapContainer"
import MainPanel from "./components/left-panel/MainPanel"

function App() {
	return (
		<div className='body-container'>
			<MainPanel />
			<RidgeMapContainer className='map' /> 
		</div>
	)
}

export default App
