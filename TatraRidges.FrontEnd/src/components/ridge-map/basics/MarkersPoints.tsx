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
					id={pointFrom.id}
					name={pointFrom.name}
					latitude={pointFrom.latitude}
					longitude={pointFrom.longitude}
				/>
			)}
			{isNotEmpty(pointTo) && (
				<MarkerPoint
					key={`marker_${pointTo.id}`}
					id={pointTo.id}
					name={pointTo.name}
					latitude={pointTo.latitude}
					longitude={pointTo.longitude}
				/>
			)}
		</>
	)
}

export default React.memo(MarkersPoints)
