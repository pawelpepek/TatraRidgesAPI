import CirclePoint from "./CirclePoint"
import { MountainPoints } from "../../types"
import MarkersPoints from "./MarkersPoints"
import React from "react"

const PointsContainer: React.FC<MountainPoints> = props => {
	if (props.points.length > 0) {
		return (
			<>
				{props.points.map(point => (
					<CirclePoint key={`circlePoint_${point.id}`} point={point} />
				))}
				<MarkersPoints />
			</>
		)
	} else {
		return <></>
	}
}

export default React.memo(PointsContainer)
