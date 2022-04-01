import { MountainPoint, Coordinates , ConnectionData} from "../types"

export const getPoints = async () =>
	load<MountainPoint[]>("https://localhost:44342/api/point/")

	export const getConnections = async () =>
	{
		const result=await load<ConnectionData[]>("https://localhost:44342/api/connection/")
		return result
	}
	

export const deletePointById = async (id: number) =>
	deleteAction("https://localhost:44342/api/point/" + id)

export const movePointById = async (id: number, body: Coordinates) =>
	putAction("https://localhost:44342/api/point/" + id, body)

export const connectPointsRidge = async (pointId1:number, pointId2:number) =>
{
	const body={
		pointId1,
		pointId2,
		ridge:true
	}
	return await action("https://localhost:44342/api/connection",'POST', body)
}

const load = async <T>(url: string): Promise<T> =>
	fetch(url).then(response => {
		if (!response.ok) {
			throw new Error(response.statusText)
		}
		return response.json() as Promise<T>
	})

const deleteAction = async (url: string): Promise<string> =>
	fetch(url, { method: "DELETE" }).then(response => {
		if (!response.ok) {
			throw new Error(response.statusText)
		}
		return response.text() as Promise<string>
	})
export const putAction = async <T>(url: string, body: T): Promise<string> =>
	await action(url, "PUT", body)

const action = async <T>(
	url: string,
	method: string,
	body: T
): Promise<string> =>
	fetch(url, {
		method,
		headers: {
			"content-type": "application/json;charset=UTF-8",
		},
		body: JSON.stringify(body),
	}).then(response => {
		if (!response.ok) {
			throw new Error(response.statusText)
		}
		return response.text() as Promise<string>
	})
