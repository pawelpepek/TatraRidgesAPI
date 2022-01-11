import MarkersContainer from "./basics/MarkersContainer"
import { useState, useEffect, useCallback, useContext } from "react"
import { MountainPoint } from "./basics/types"
import { getPoints } from "./helpers/fetcher"
import { RidgesContext } from "../context/map-context"


const RidgesMarkersContainer: React.FC = () => {
	const ridgeContext= useContext(RidgesContext)

	return <MarkersContainer points={ridgeContext.points} />
}

export default RidgesMarkersContainer
