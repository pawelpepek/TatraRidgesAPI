import MarkerPoint from "./MarkerPoint"
import { MountainPoints } from "./types"

const MarkersContainer: React.FC<MountainPoints> = props => {
	return (
		<>
			{props.points.map(point => (
				<MarkerPoint
					key={point.id}
					id={point.id}
					name={point.name}
					latitude={point.latitude}
					longitude={point.longitude}
					pointTypeId={point.pointTypeId}
				/>
			))}
		</>
	)
}

export default MarkersContainer
