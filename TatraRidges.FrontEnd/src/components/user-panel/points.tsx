import { useContext } from "react"
import { RidgesContext } from "../context/map-context"

const PointsPanel: React.FC = () => {
	const ridgeContext = useContext(RidgesContext)
	return (
		<>
			<div>
				<p>Point1: {ridgeContext.actualPointId}</p>
			</div>
			<button onClick={ridgeContext.switchPoints}>Odwróć</button>
			<div>
				<p>Point2: {ridgeContext.lastPointId}</p>
			</div>
			<button onClick={ridgeContext.deleteActualPoint}>Usuń punkt</button>
			<button onClick={ridgeContext.connectActualPointsRidge}>
				Połacz punkty
			</button>
		</>
	)
}

export default PointsPanel
