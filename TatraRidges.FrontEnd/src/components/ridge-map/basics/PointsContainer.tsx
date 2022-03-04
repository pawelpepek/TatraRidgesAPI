import CirclePoint from "./CirclePoint"
import { MountainPoints } from "../../types"
import MarkersPoints from "./MarkersPoints"
import React from "react"

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
						evaluation={point.evaluation}
					/>
				))}
				<MarkersPoints/>
			</>
		)
	} else {
		return <></>
	}
}

export default React.memo(PointsContainer)
