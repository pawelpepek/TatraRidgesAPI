import { testText, testClass } from "../../helpers/testHelper"
import { MountainPoint } from "../../types"
import PointInfo from "./PointInfo"

const testPoint: MountainPoint = {
	id: 1,
	evaluation: 2000,
	name: "Szczyt",
	pointTypeId: 1,
	latitude: 50,
	longitude: 20,
}

describe("PointInfo component", () => {
	test("render Point name Szczyt as a text", () =>
		testText(getTestPointInfo(), "Szczyt"))
	test("render Point evaluation 2000 as a text", () =>
		testText(getTestPointInfo(), "2000"))
	test("render component with withButton equals true gives section with className 'point-with-delete'", () =>
		testClass(getTestPointInfo(true), "section", "point-with-delete"))
	test("render component with withButton equals false gives section withouth className 'point-with-delete'", () =>
		testClass(getTestPointInfo(false), "section", "point-with-delete", false))
})

const getTestPointInfo = (withButton: boolean = false) => (
	<PointInfo point={testPoint} withButton={withButton} />
)
