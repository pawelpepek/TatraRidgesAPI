import "./App.css"
import RidgeMapContainer from "./components/ridge-map/RidgeMapContainer"
import AdminPanel from "./components/user-panel/admin-panel"

function App() {
	return (
		<div className='body-container'>
			<div className='left-panel'>
				<AdminPanel />
			</div>
			<RidgeMapContainer />
		</div>
	)
}

export default App
