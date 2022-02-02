import { render, screen } from "@testing-library/react"
import CheckBoxRow from "./CheckboxRow"

describe("CheckboxRow component", () => {
	test("render Test as label text", () => {
		//Arrange
		render(<CheckBoxRow labelText='Test' onChange={() => {}} id='testCh' />)

		//Act

		//Assert
		const element = screen.getByText("Test", { exact: false })
		expect(element).toBeInTheDocument()
	})
})
