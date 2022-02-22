import { MountainPoint } from "../components/types";

export interface RidgeAllInformation {
	initalRouteSummary: RouteSummary
	ridgesContainer: RidgeWithRoutes[]
}

export interface RouteSummary extends RouteOptions {
	isEmptyRoute: boolean
	isConsistentDirection: boolean
	maxDifficulty: Difficulty
	avarageDifficulty: Difficulty
	description: string
}

export interface RidgeWithRoutes {
	pointId1: number
	pointId2: number
	point1?:MountainPoint
	point2?:MountainPoint
	pointsConnectionId: number
	routes: Route[]
	selectedId:number
}

export interface Difficulty {
	text: string
	value: number
}

export interface Route extends RouteOptions {
	id: number
	consistentDirection: boolean
	difficultyValue: number
	difficulty: string
	routeType: RouteType
	guideDescription: GuideDescription
	descriptionAdjective: Adjective[]
}

export interface RouteOptions {
	routeTime: Date
	rank: number
	rappeling: boolean
	description: string
}

export interface RouteType {
	id: number
	name: string
	rank: number
}

export interface GuideDescription {
	number: string
	page: number
	volume: number
	guide: string
}

export interface Adjective {
	id: string
	text: string
}
