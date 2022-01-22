import "./App.css"
import RidgeMapContainer from "./components/ridge-map/RidgeMapContainer"
import MainPanel from "./components/lleft-panel/main-panel"

function App() {
	return (
		<div className='body-container'>
			<MainPanel/>
			<RidgeMapContainer />
		</div>
	)
}

export default App
