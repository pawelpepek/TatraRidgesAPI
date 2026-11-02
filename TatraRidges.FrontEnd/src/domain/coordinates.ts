import { Coordinates } from "./types"

export class DecimalRange {
	constructor(
		readonly minValue: number,
		readonly maxValue: number
	) {}

	isNumberInThisRange(value: number) {
		return value >= this.minValue && value <= this.maxValue
	}

	messageForValue(name: string) {
		return `${name} musi być z zakresu <${this.minValue}; ${this.maxValue}>.`
	}
}

const latitudeRange = new DecimalRange(49.12, 49.29)
const longitudeRange = new DecimalRange(19.91, 20.29)

export const isCoordinatesValid = (coordinates: Coordinates) =>
	latitudeRange.isNumberInThisRange(coordinates.latitude) &&
	longitudeRange.isNumberInThisRange(coordinates.longitude)

export const coordinatesErrorMessage = (coordinates: Coordinates) => {
	const messages: string[] = []
	if (!latitudeRange.isNumberInThisRange(coordinates.latitude)) {
		messages.push(latitudeRange.messageForValue("Szerokość geograficzna"))
	}
	if (!longitudeRange.isNumberInThisRange(coordinates.longitude)) {
		messages.push(longitudeRange.messageForValue("Długość geograficzna"))
	}
	return messages.join("\n")
}
