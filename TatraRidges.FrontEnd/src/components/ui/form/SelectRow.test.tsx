import { render, screen } from "@testing-library/react"
import SelectRow from "./SelectRow"

describe("InutRow component", () => {
	test("render Test as label text", () => testText("Test")),
		test("render component with options equals array contains 6 elements gives 6 options", () => {
			//Assert
			const element = getTestElement()
			if (element !== null) {
				expect(element.childElementCount).toBe(6)
			}
		})
	test("render component with options equals array contains 't/est6' elements gives text 't/est6", () =>
		testText("t/est6"))
})

const testText = (text: string) => {
	//Arrange
	render(getTestSelectedRow())

	//Act

	//Assert
	const element = screen.getByText(text, { exact: true })
	if (element != null) {
		expect(element).toBeInTheDocument()
	}
}

const getTestElement = () => {
	//Arrange
	const { container } = render(getTestSelectedRow())

	//Act

	//Assert
	return container.querySelector("select")
}

const getTestSelectedRow = () => {
	return (
		<SelectRow
			labelText='Test'
			onChange={() => {}}
			id='testInput'
			options={getTestOptions()}
		/>
	)
}

const getTestOptions = () => {
	return [
		getOptionRow("test1"),
		getOptionRow("test2"),
		getOptionRow("test3"),
		getOptionRow("test4"),
		getOptionRow("Test5"),
		getOptionRow("t/est6"),
	]
}

const getOptionRow = (value: string) => {
	return { value, text: value }
}
