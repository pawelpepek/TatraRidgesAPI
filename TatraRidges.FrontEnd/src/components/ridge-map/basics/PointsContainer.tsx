import CirclePoint from "./CirclePoint"
import { MountainPoints } from "../../types"

const PointsContainer: React.FC<MountainPoints> = props => {
	if (props.points.length > 0) {
		return (
			<>
				{props.points.map(point => (
					<CirclePoint
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
	} else {
		return <></>
	}
}

export default PointsContainer
