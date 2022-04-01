export function getNotNullable<T>(value: T | null | undefined) {
	if (value == undefined || value === null) {
		return {} as T
	} else {
		return value as T
	}
}
export function destructDifficultyValue(value: number) {
	const valueNumber = Math.round(value)
	const difference = value - valueNumber
	let sign = ""
	if (difference > 0) {
		sign = "+"
	}
	if (difference < 0) {
		sign = "-"
	}

	return { valueNumber, sign }
}

export function isNotEmpty<T>(value:T){
    return Object.keys(value).length>0
}
