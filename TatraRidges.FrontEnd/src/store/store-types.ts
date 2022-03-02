import {
	ConnectionPoints,
	Coordinates,
	MountainPoint,
} from "../components/types"

import { Adjective, Difficulty, Guide, RidgeAllInformation, RouteType } from "./routeTypes"

interface StoreType {
	adminMode: { value: boolean }
	map: {
		connections: ConnectionPoints[]
		pointsOk: boolean
		points: MountainPoint[]
		pointFrom: MountainPoint
		pointTo: MountainPoint
		ridgeInfo: RidgeAllInformation
	}
	ui: {
		visiblePanel: string
		notification: {
			status: string
			title: string
			message: string
		}
		visibleAdminPart: string
		selectedRoutePart: number
		isLogged: boolean
		isRouteVisible: boolean
	}
	center: {
		value: {
			coordinates: Coordinates
			zoom: number
		}
	}
	routeForm: {
		isRunning:boolean
		containerValues: {
			guides: Guide[]
			routeTypes: RouteType[]
			difficulties: Difficulty[]
			adjectives: Adjective[]
		}
		guide: number
		volume: number | null
		number: string
		difficulty: number
		adjectives: string[]
		routeTypeId: number
		rappeling: boolean
		page: number | null
		routeTime: Date | null
		isFilled: boolean
	}
	loginForm: {
		email: string
		password: string
		isFilled: boolean
	}
}

export default StoreType
