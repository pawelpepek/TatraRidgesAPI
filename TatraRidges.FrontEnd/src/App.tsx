import "./App.css"
import RidgeMapContainer from "./components/ridgeMap/RidgeMapContainer"
import PointsPanel from './components/user-panel/points'

function App() {
	return (
		<div className="body-container">
		<div className='left-panel'>
			<PointsPanel/>
		</div>
				<RidgeMapContainer />
		</div>
	)
}

export default App
