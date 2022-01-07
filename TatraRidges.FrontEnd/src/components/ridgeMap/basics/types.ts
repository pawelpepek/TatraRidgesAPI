export interface RidgeMapProps {
	id?: string
	className?: string
}

export interface MountainPoint {
	name: string
    latitude: number
	longitude: number
	id: number
	pointTypeId: number
}

export interface MountainPoints{
    points:MountainPoint[]
}
