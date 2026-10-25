// Data model stored in Firestore (see CLAUDE.md, "Firestore data model").

export interface AdjectiveData {
	id: string
	text: string
	rank: number
}

export interface DifficultyData {
	id: number
	text: string
}

export interface DifficultyDetailData {
	id: number
	sign: string
}

export interface GuideData {
	id: number
	shortName: string
	name: string
	author: string
}

export interface RouteTypeData {
	id: number
	name: string
	rank: number
}

export interface PointTypeData {
	id: number
	name: string
}

export interface Params {
	adjectives: AdjectiveData[]
	difficulties: DifficultyData[]
	difficultyDetails: DifficultyDetailData[]
	guides: GuideData[]
	routeTypes: RouteTypeData[]
	pointTypes: PointTypeData[]
}

export interface PointData {
	id: number
	name: string
	altName: string | null
	evaluation: number | null
	precisedEvaluation: boolean
	lat: number
	lng: number
	wikiLat: number
	wikiLng: number
	wikiAddress: string | null
	pointTypeId: number
}

export interface AdditionalDescriptionData {
	description: string
	warning: boolean
}

export interface RouteData {
	id: number
	consistentDirection: boolean
	difficultyId: number
	difficultyDetailId: number
	rappeling: boolean
	routeTypeId: number
	routeTimeMin: number
	guideId: number
	guideNumber: string
	guidePage: number
	guideVolume: number
	adjectiveIds: string[]
	additional: AdditionalDescriptionData[]
}

export interface RidgeData {
	id: number
	pointId1: number
	pointId2: number
	routes: RouteData[]
}

export interface TatraData {
	points: PointData[]
	ridges: RidgeData[]
	params: Params
}

// Results, in the same JSON shape the ASP.NET API returned.
// `routeTime` is a .NET TimeSpan string ("hh:mm:ss" or "d.hh:mm:ss").

export interface Coordinates {
	latitude: number
	longitude: number
}

export interface MountainPointDto {
	id: number
	pointTypeId: number
	name: string
	evaluation: number | null
	latitude: number
	longitude: number
}

export interface PointsRidgeDto {
	id: number
	pointId1: number
	pointId2: number
	pointFrom: Coordinates
	pointTo: Coordinates
}

export interface DifficultyDto {
	text: string
	value: number
}

export interface AdjectiveDto {
	id: string
	text: string
}

export interface RouteTypeDto {
	id: number
	name: string
	rank: number
}

export interface GuideDescriptionDto {
	number: string
	page: number
	volume: number
	guide: string
}

export interface RouteDto {
	id: number
	consistentDirection: boolean
	difficultyValue: number
	difficulty: string
	rappeling: boolean
	routeType: RouteTypeDto
	guideDescription: GuideDescriptionDto
	rank: number
	routeTime: string
	descriptionAdjective: AdjectiveDto[]
	info: string
	warning: string
}

export interface RidgeWithRoutesDto {
	pointId1: number
	pointId2: number
	pointsConnectionId: number
	routes: RouteDto[]
}

export interface RouteSummary {
	isEmptyRoute: boolean
	isConsistentDirection: boolean
	routeTime: string
	maxDifficulty: DifficultyDto
	avarageDifficulty: DifficultyDto
	rank: number
	rappeling: boolean
	description: string
	warning: string
	info: string
}

export interface RidgeAllInformation {
	initalRouteSummary: RouteSummary
	ridgesContainer: RidgeWithRoutesDto[]
}

export interface RouteIdFrom {
	routeId: number
	pointFrom: number
}

export interface GuideDto {
	id: number
	shortName: string
	name: string
	author: string
}

export interface ParametersDto {
	adjectives: AdjectiveDto[]
	difficulties: DifficultyDto[]
	guides: GuideDto[]
	routeTypes: RouteTypeDto[]
}

export interface PointsConnectionWithDirection {
	ridge: RidgeData
	consistDirection: boolean
}

// Admin input, as sent by the route form (see AddRoute in store/routeTypes.ts).

export interface AddRouteInput {
	pointId1: number
	pointId2: number
	difficultyValue: number
	difficultySign: string
	rappeling: boolean
	routeType: number
	guideDescription: {
		guideId: number
		page: number
		volume: number
		number: string
	}
	routeTime: string
	adjectives: string[]
	additionalDescriptions: AdditionalDescriptionData[]
}

export interface RouteCreateResult {
	routeId: number
	pointsRidge: PointsRidgeDto | null
}
