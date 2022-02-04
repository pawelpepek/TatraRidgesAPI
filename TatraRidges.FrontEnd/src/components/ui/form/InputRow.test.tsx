import { render, screen } from "@testing-library/react"
import InputRow from "./InputRow"

describe("InutRow component", () => {
	test("render Test as label text", () => {
		//Arrange
		render(
			<InputRow
				labelText='Test'
				onChange={() => {}}
				id='testInput'
				type='text'
			/>
		)

		//Act

		//Assert
		const element = screen.getByText("Test", { exact: false })
		expect(element).toBeInTheDocument()
	}),
		test("render component with type equals text contains text input", () =>
			testType("text")),
		test("render component with type equals number contains text number", () =>
			testType("number")),
		test("render component with type equals time contains text time", () =>
			testType("time"))
})

const testType = (type: string) => {
	//Arrange
	const { container } = render(
		<InputRow labelText='Test' onChange={() => {}} id='testInput' type={type} />
	)

	//Act

	//Assert

	const element = container.querySelector(type)
	if (element !== null) {
		expect(element).toBeInTheDocument()
	}
}
