import { PointsConnectionWithDirection, RidgeData } from "./types"

class SearchPoint {
	readonly connections: SearchConnection[] = []

	constructor(readonly id: number) {}
}

class SearchConnection {
	private readonly subscribers: SearchPoint[] = []

	constructor(readonly data: RidgeData) {}

	subscribe(point: SearchPoint) {
		if (!this.subscribers.includes(point)) {
			this.subscribers.push(point)
			point.connections.push(this)
		}
	}

	delete() {
		for (const point of this.subscribers) {
			const index = point.connections.indexOf(this)
			if (index >= 0) {
				point.connections.splice(index, 1)
			}
		}
	}
}

// Graph of all ridges. Leaves other than the two searched points are pruned
// until nothing changes; what is left is the path between them.
class SearchPoints {
	private readonly points: SearchPoint[] = []
	private readonly routeIds: number[]

	constructor(ridges: RidgeData[], id1: number, id2: number) {
		for (const ridge of ridges) {
			const connection = new SearchConnection(ridge)
			connection.subscribe(this.getPoint(ridge.pointId1))
			connection.subscribe(this.getPoint(ridge.pointId2))
		}
		this.routeIds = [id1, id2]
	}

	onlyRidge() {
		let count = this.points.length
		let process = true
		while (process) {
			this.removeLastLeaf()
			process = this.points.length !== count
			count = this.points.length
		}
	}

	connections() {
		const result: RidgeData[] = []
		for (const point of this.points) {
			for (const connection of point.connections) {
				if (!result.some(r => r.id === connection.data.id)) {
					result.push(connection.data)
				}
			}
		}
		return result
	}

	private removeLastLeaf() {
		const removed = this.points.filter(
			p => p.connections.length === 1 && !this.routeIds.includes(p.id)
		)
		for (let i = removed.length - 1; i >= 0; i--) {
			if (removed[i].connections.length > 0) {
				removed[i].connections[0].delete()
			}
			this.points.splice(this.points.indexOf(removed[i]), 1)
		}
	}

	private getPoint(id: number) {
		let point = this.points.find(p => p.id === id)
		if (point === undefined) {
			point = new SearchPoint(id)
			this.points.push(point)
		}
		return point
	}
}

// Ridge sections from pointFromId to pointToId, in walking order.
// Empty when the points are not connected by ridges.
export const findRidge = (
	ridges: RidgeData[],
	pointFromId: number,
	pointToId: number
): PointsConnectionWithDirection[] => {
	const points = new SearchPoints(ridges, pointFromId, pointToId)
	points.onlyRidge()

	const connections = points.connections()
	const count = connections.length
	const result: PointsConnectionWithDirection[] = []

	let fromId = pointFromId
	for (let i = 0; i < count; i++) {
		const ridge = connections.find(
			c => c.pointId1 === fromId || c.pointId2 === fromId
		)
		if (ridge === undefined) {
			throw new Error(
				`Grań z punktu ${pointFromId} do ${pointToId} jest niespójna`
			)
		}
		const consistDirection = ridge.pointId1 === fromId
		fromId = consistDirection ? ridge.pointId2 : ridge.pointId1
		connections.splice(connections.indexOf(ridge), 1)
		result.push({ ridge, consistDirection })
	}

	return result
}
