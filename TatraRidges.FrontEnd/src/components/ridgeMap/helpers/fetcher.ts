import { MountainPoint } from "../basics/types"

export const getPoints = async () =>
	load<MountainPoint[]>("https://localhost:44342/api/point/")

const load = async <T>(url: string): Promise<T> =>
	fetch(url).then(response => {
		if (!response.ok) {
			throw new Error(response.statusText)
		}
		return response.json() as Promise<T>
	})
