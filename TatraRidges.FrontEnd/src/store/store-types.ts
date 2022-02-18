import {
	ConnectionPoints,
	Coordinates,
	MountainPoint,
} from "../components/types"

import {RidgeAllInformation} from "./routeTypes"

import { OptionsProps} from "./route-form-slice"

interface StoreType {
	adminMode: { value: boolean }
	map: {
		connections: ConnectionPoints[]
		pointsOk: boolean
		points: MountainPoint[]
		pointFrom: MountainPoint
		pointTo: MountainPoint
		ridgeInfo:RidgeAllInformation
	}
	ui: {
		visiblePanel: string
		notification: {
			status: string
			title: string
			message: string
		}
		visibleAdminPart: string
		isLogged:boolean
		isRouteVisible:boolean
	}
	center: {
		value: {
			coordinates: Coordinates
			zoom: number
		}
	}
	routeForm: {
		consistentDirection: boolean
		guide: string
		volume: number | null
		number: string
		difficulty: string
		adjectives: string[]
		routeTypeId: Number
		rappeling: boolean
		page: number | null
		routeTime: Date | null
		isFilled:boolean
	}
	loginForm:{
		email:string
		password:string
		isFilled:boolean
	}
}

export default StoreType
