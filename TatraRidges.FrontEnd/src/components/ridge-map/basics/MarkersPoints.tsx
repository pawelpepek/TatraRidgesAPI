import React from "react"
import { useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import { isNotEmpty } from "../../helpers/functions"
import MarkerPoint from "./MarkerPoint"

const MarkersPoints: React.FC = () => {
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)
	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)

	return (
		<>
			{isNotEmpty(pointFrom) && (
				<MarkerPoint
					key={`marker_${pointFrom.id}`}
					point={pointFrom}
					end={false}
				/>
			)}
			{isNotEmpty(pointTo) && (
				<MarkerPoint key={`marker_${pointTo.id}`} point={pointTo} end={true} />
			)}
		</>
	)
}

export default MarkersPoints
