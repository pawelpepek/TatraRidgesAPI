const pad = (value: number) => value.toString().padStart(2, "0")

// Formats minutes like .NET TimeSpan.ToString("c"): "hh:mm:ss" or "d.hh:mm:ss".
export const formatTimeSpan = (minutes: number) => {
	const days = Math.floor(minutes / 1440)
	const hours = Math.floor((minutes % 1440) / 60)
	const rest = minutes % 60
	const time = `${pad(hours)}:${pad(rest)}:00`
	return days > 0 ? `${days}.${time}` : time
}

// Parses "hh:mm", "hh:mm:ss" or "d.hh:mm:ss" into whole minutes (seconds are dropped).
export const parseTimeSpan = (text: string) => {
	const parts = text.split(":")
	const first = parts[0].split(".")
	const days = first.length > 1 ? parseInt(first[0]) : 0
	const hours = parseInt(first[first.length - 1])
	const minutes = parseInt(parts[1])
	if ([days, hours, minutes].some(isNaN)) {
		throw new Error(`Niepoprawny czas: ${text}`)
	}
	return days * 1440 + hours * 60 + minutes
}
