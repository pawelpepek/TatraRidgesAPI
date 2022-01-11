import { MountainPoint } from "../basics/types"

export const getPoints = async () =>
	load<MountainPoint[]>("https://localhost:44342/api/point/")

export const deletePointById = async (id: number) => deleteAction("https://localhost:44342/api/point/"+id)

const load = async <T>(url: string): Promise<T> =>
	fetch(url).then(response => {
		if (!response.ok) {
			throw new Error(response.statusText)
		}
		console.log("delete")
		return response.json() as Promise<T>
	})

const deleteAction = async <T>(url: string): Promise<string> =>
	fetch(url, { method: "DELETE" }).then(response => {
		if (!response.ok) {
			throw new Error(response.statusText)
		}
		return response.text() as Promise<string>
	})
