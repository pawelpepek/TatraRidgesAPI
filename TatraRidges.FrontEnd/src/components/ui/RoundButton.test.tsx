import { render, screen } from "@testing-library/react"
import RoundButton from "./RoundButton"
import icon from "../img/plus.svg"

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
			makeTestButton(true, undefined)),
		test("render not selected component withouth className selected", () =>
			makeTestButton(false, undefined)),
		test("render disabled component with className disabled", () =>
			makeTestButton(undefined, true)),
		test("render not disabled component withouth className disabled", () =>
			makeTestButton(undefined, false)),
		test("render component with className test has className test", () => {
			//Arrange
			const { container } = render(
				<RoundButton alt='Message' imageSrc={icon} className='test' />
			)

			//Act

			//Assert
			const button = container.querySelector("button")
			if (button != null) {
				expect(button.classList.contains("test")).toBe(true)
			}
		})
})

const makeTestButton = (
	selected: boolean | undefined,
	disabled: boolean | undefined
) => {
	//Arrange
	const { container } = render(
		<RoundButton
			alt='Message'
			imageSrc={icon}
			selected={selected}
			disabled={disabled}
		/>
	)

	//Act

	//Assert
	const button = container.querySelector("button")

	if (button !== null) {
		if (selected !== undefined) {
			expect(button.classList.contains("selected")).toBe(selected)
		}
		if (disabled !== undefined) {
			expect(button.classList.contains("disabled")).toBe(disabled)
		}
	}
}
