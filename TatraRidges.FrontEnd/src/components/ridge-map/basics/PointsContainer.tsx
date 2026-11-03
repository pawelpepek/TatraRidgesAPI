import PointSymbol from "./PointSymbol"
import { MountainPoints } from "../../types"
import MarkersPoints from "./MarkersPoints"
import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import { ridgeAngles } from "./pointSymbols"

const PointsContainer: React.FC<MountainPoints> = props => {
	// All ridges, not only the displayed ones, so a pass keeps its direction
	// when only a route is shown.
	const connections = useSelector((state: StoreType) => state.map.connections)
	const angles = useMemo(() => ridgeAngles(connections), [connections])

	if (props.points.length > 0) {
		return (
			<>
				{props.points.map(point => (
					<PointSymbol
						key={`pointSymbol_${point.id}`}
						point={point}
						ridgeAngle={angles.get(point.id) ?? 0}
					/>
				))}
				<MarkersPoints />
			</>
		)
	} else {
		return <></>
	}
}

export default React.memo(PointsContainer)
