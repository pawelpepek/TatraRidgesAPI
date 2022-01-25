import {
	ConnectionPoints,
	Coordinates,
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
		visiblePanel:string,
        notification:{
            status: string
            title: string
            message: string
        },
		logged:boolean
    }
	center:{
		value:{
			coordinates:Coordinates,
			zoom:number
		}
	}
}

export default StoreType
