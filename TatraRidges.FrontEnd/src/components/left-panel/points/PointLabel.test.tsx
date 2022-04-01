import { MountainPoint } from "../../types"
import PointLabel from "./PointLabel"

const point: MountainPoint = {
	id: 1,
	evaluation: 2000,
	name: "Szczyt",
	pointTypeId: 1,
	latitude: 50,
	longitude: 20,
}
const pointLabel = <PointLabel point={point} />

describe("PointInfo component", () => {
	test("nothing", () => expect(true).toBe(true))
})
