import MountainMap from "./basics/MountainMap"
import RidgesLinesContainer from "./RidgesLinesContainer"
import RidgesPointsContainer from "./RidgesPointsContainer"
import React from "react"

const RidgeMapContainer: React.FC = () => {
	return (
		<MountainMap>
			<RidgesPointsContainer />
			<RidgesLinesContainer />
		</MountainMap>
	)
}

export default React.memo(RidgeMapContainer)
