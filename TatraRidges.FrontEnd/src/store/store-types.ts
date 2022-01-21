import {
	ConnectionPoints,
	MountainPoint,
} from "../components/types"

interface StoreType {
	adminMode: { value: boolean }
	map: {
		connections: ConnectionPoints[]
		pointsOk: boolean
		points: MountainPoint[]
		pointFrom: MountainPoint
		pointTo: MountainPoint
	}
}

export default StoreType
