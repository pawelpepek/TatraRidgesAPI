export interface RidgeMapProps {
	id?: string
	className?: string
    lat?:number
    log?:number
    zoom?:number
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

export interface ConnectionData{
    id:number
    pointId1:number
    pointId2:number
}

export interface PositionZoomInfo{
    lat:number
    log:number
    zoom:number
}

export interface ConnectionLineProps{
    id:number
    point1:MountainPoint
    point2:MountainPoint
    color?: string | undefined;
    onChangePositionZoom?(info:PositionZoomInfo):void
}

