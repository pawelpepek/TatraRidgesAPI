import L from "leaflet"
import { ConnectionPoints, MountainPoint } from "../../types"

export const PEAK = 1
export const PASS = 2

const SIZE = 20

const SYMBOL_COLOR = "#222"

// Ridge direction at every point in screen degrees (0 = east, clockwise),
// averaged over its ridges as axes: doubled angles make a ridge leaving
// to the west the same direction as one leaving to the east.
export const ridgeAngles = (connections: ConnectionPoints[]) => {
	const sums = new Map<number, { x: number; y: number }>()

	const add = (from: MountainPoint, to: MountainPoint) => {
		const dx =
			(to.longitude - from.longitude) *
			Math.cos((from.latitude * Math.PI) / 180)
		const dy = from.latitude - to.latitude
		if (dx === 0 && dy === 0) {
			return
		}
		const angle = 2 * Math.atan2(dy, dx)
		const sum = sums.get(from.id) ?? { x: 0, y: 0 }
		sum.x += Math.cos(angle)
		sum.y += Math.sin(angle)
		sums.set(from.id, sum)
	}

	for (const c of connections) {
		add(c.point1, c.point2)
		add(c.point2, c.point1)
	}

	const angles = new Map<number, number>()
	sums.forEach((sum, id) => {
		// + 0 turns -0 into 0
		angles.set(id, Math.round((Math.atan2(sum.y, sum.x) * 90) / Math.PI) + 0)
	})

	return angles
}

// Drawn for a ridge running east-west: the arcs stand on the ridge
// on both sides of the pass.
export const passSvg = (color: string) => {
	const arcs = "M5 3Q9.5 10 5 17M15 3Q10.5 10 15 17"
	return `<path d="${arcs}" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>
<path d="${arcs}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`
}

export const peakSvg = (color: string) =>
	`<path d="M10 2.5L18 16.5H2Z" fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>`

export const otherSvg = (color: string) =>
	`<circle cx="10" cy="10" r="6" fill="none" stroke="white" stroke-width="5"/>
<circle cx="10" cy="10" r="6" fill="none" stroke="${color}" stroke-width="2.5"/>`

export const pointIcon = (pointTypeId: number, ridgeAngle: number) => {
	let content: string
	let rotation = 0
	if (pointTypeId === PEAK) {
		content = peakSvg(SYMBOL_COLOR)
	} else if (pointTypeId === PASS) {
		content = passSvg(SYMBOL_COLOR)
		rotation = ridgeAngle
	} else {
		content = otherSvg(SYMBOL_COLOR)
	}

	return L.divIcon({
		html: `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 20 20" style="display:block;transform:rotate(${rotation}deg)">${content}</svg>`,
		className: "leaflet-div-icon",
		iconSize: [SIZE, SIZE],
		iconAnchor: [SIZE / 2, SIZE / 2],
		tooltipAnchor: [SIZE / 2, 0],
	})
}
