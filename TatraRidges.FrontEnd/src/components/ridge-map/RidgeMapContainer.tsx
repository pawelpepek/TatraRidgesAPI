import MountainMap from "./basics/MountainMap"
import RidgesLinesContainer from "./RidgesLinesContainer"
import RidgesPointsContainer from "./RidgesPointsContainer"
import RouteFit from "./RouteFit"
import DataAttribution from "./DataAttribution"
import React from "react"

const RidgeMapContainer: React.FC = () => {
	return (
		<MountainMap>
			<RidgesPointsContainer />
			<RidgesLinesContainer />
			<RouteFit />
			<DataAttribution />
		</MountainMap>
	)
}

export default RidgeMapContainer
