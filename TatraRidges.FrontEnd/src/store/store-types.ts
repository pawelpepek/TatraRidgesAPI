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
    ui:{
        notification:{
            status: string
            title: string
            message: string
        }
    }
}

export default StoreType
