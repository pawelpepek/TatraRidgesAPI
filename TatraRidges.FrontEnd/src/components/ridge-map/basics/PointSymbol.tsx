import React, { useMemo } from "react"
import { Marker } from "react-leaflet"
import { MountainPoint } from "../../types"
import { Tooltip } from "react-leaflet"
import usePointClick from "../../../hooks/use-point-click"
import { pointIcon } from "./pointSymbols"

interface PointSymbolProps {
	point: MountainPoint
	ridgeAngle: number
}

const PointSymbol: React.FC<PointSymbolProps> = props => {
	const setClicked = usePointClick(props.point)

	const icon = useMemo(
		() => pointIcon(props.point.pointTypeId, props.ridgeAngle),
		[props.point.pointTypeId, props.ridgeAngle]
	)

	return (
		<Marker
			position={[props.point.latitude, props.point.longitude]}
			icon={icon}
			key={`point_${props.point.id}`}
			pane={"pointsPane"}
			eventHandlers={{
				click: () => setClicked(),
			}}
		>
			<Tooltip>{props.point.name}</Tooltip>
		</Marker>
	)
}

export default React.memo(PointSymbol)
