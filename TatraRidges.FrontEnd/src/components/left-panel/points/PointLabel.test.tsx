import { render, screen } from "@testing-library/react"
import { testText } from "../../helpers/testHelper"
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
	// test("render Point name Szczyt as a text", () =>
	// 	testText({ component: pointLabel }, "Szczyt"))
	// test("render Point evaluation 2000 as a text", () => testText("2000"))

	// test("render component with withButton equals true gives button", () =>
	// 	testButton(true))
	// test("render component with withButton equals false gives no button", () =>
	// 	testButton(false))
	test("nothing", () => expect(true).toBe(true))
})

// const testText = (text: string) => {
// 	//Arrange
// 	render(<PointLabel point={getPoint()} />)

// 	//Act

// 	//Assert
// 	const element = screen.getByText(text, { exact: false })
// 	if (element !== null) {
// 		expect(element).toBeInTheDocument()
// 	}
// }

// const testButton = (visible: boolean) => {
// 	//Arrange
// 	const { container } = render(
// 		<PointLabel point={getPoint()} deleteVisible={visible} />
// 	)

// 	//Act

// 	//Assert
// 	const element = container.querySelector("button")
// 	if (visible) {
// 		if (element !== null) {
// 			expect(element).toBeInTheDocument()
// 		}
// 	} else {
// 		expect(element).toBeNull()
// 	}
// }
