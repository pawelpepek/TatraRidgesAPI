import { render, screen } from "@testing-library/react"
import { testClass } from "../helpers/testHelper"
import RoundButton from "./RoundButton"
import icon from "../img/plus.svg"

const testClassButton = (
	<RoundButton alt='Message' imageSrc={icon} className='test' />
)

describe("RoundButton component", () => {
	test("render component with alt equal Message has image with alt equal Message", () => {
		//Arrange
		render(<RoundButton alt='Message' imageSrc={icon} />)

		//Act

		//Assert
		const messageElement = screen.getByAltText("Message", { exact: true })
		expect(messageElement).toBeInTheDocument()
	}),
		test("render selected component with className selected", () =>
			testClasses(true, undefined)),
		test("render not selected component withouth className selected", () =>
			testClasses(false, undefined)),
		test("render disabled component with className disabled", () =>
			testClasses(undefined, true)),
		test("render not disabled component withouth className disabled", () =>
			testClasses(undefined, false)),
		test("render component with className test has className test", () =>
			testClass(testClassButton, "button", "test"))
})

const getTestButton = (
	selected: boolean | undefined = undefined,
	disabled: boolean | undefined = undefined
) => (
	<RoundButton
		alt='Message'
		imageSrc={icon}
		selected={selected}
		disabled={disabled}
	/>
)

const testClasses = (
	selected: boolean | undefined,
	disabled: boolean | undefined
) => {
	const component = getTestButton(selected, disabled)

	const selectedClass = selected !== undefined ? "selected" : ""
	const disabledClass = disabled !== undefined ? "disabled" : ""
	const className = disabledClass + selectedClass

	const isIn = selected !== undefined ? selected : disabled

	testClass(component, "button", className, isIn)
}
