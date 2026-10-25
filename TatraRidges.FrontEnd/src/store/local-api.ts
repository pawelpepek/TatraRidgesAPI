import {
	getMountainPoints,
	getParameters,
	getRidges,
	getRouteBetweenPoints,
	getRouteSummary,
	RouteIdFrom,
	TatraData,
} from "../domain"
import { getMessage } from "./statusCodeMessage"

export interface RequestProps {
	method: string
	location: string
	pathPart?: string | number
	body?: unknown
}

// Answers the requests that used to go to the ASP.NET API, computing the results
// locally from the whole data set.
export const handleRequest = (props: RequestProps, data: TatraData) => {
	switch (`${props.method} ${props.location}`) {
		case "GET point":
			return getMountainPoints(data.points)
		case "GET connection":
			return getRidges(data)
		case "GET route": {
			const query = new URLSearchParams(String(props.pathPart ?? ""))
			const info = getRouteBetweenPoints(
				data,
				Number(query.get("from")),
				Number(query.get("to"))
			)
			if (info.ridgesContainer.length === 0) {
				throw new Error(getMessage(404))
			}
			return info
		}
		case "POST route/parts":
			return getRouteSummary(data, props.body as RouteIdFrom[])
		case "GET route/parameters":
			return getParameters(data.params)
		default:
			throw new Error(
				`Operacja ${props.method} ${props.location} nie jest jeszcze dostępna w trybie Firebase`
			)
	}
}
