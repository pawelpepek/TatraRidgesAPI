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
		testText({ component: getTestPointInfo() }, "Szczyt"))
	test("render Point evaluation 2000 as a text", () =>
		testText({ component: getTestPointInfo(), reducerName: "map" }, "2000"))
	test("render component with withButton equals true gives section with className 'point-with-delete'", () =>
		testClass(
			{ component: getTestPointInfo(true), elementSelector: "section" },
			{ className: "point-with-delete", includes: true }
		))
	test("render component with withButton equals false gives section withouth className 'point-with-delete'", () =>
		testClass(
			{ component: getTestPointInfo(false), elementSelector: "section" },
			{ className: "point-with-delete", includes: false }
		))
})

const getTestPointInfo = (withButton: boolean = false) => (
	<PointInfo point={testPoint} withButton={withButton} />
)
