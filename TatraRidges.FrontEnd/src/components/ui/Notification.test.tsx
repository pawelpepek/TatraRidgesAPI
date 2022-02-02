import { render, screen } from "@testing-library/react"
import Notification from "./Notification"

describe("Notification component", () => {
	test("render Message as a text", () => {
		//Arrange
		render(<Notification status='error' message='Message' />)

		//Act

		//Assert
		const messageElement = screen.getByText("Message", { exact: false })
		expect(messageElement).toBeInTheDocument()
	})
	test("render error with className error", () => makeTestDiv("error"))
	test("render success with className success", () => makeTestDiv("success"))
	test("render pending with className pending", () => makeTestDiv("pending"))
})

const makeTestDiv = (status: string) => {
	//Arrange
	const { container } = render(
		<Notification status={status} message='Message' />
	)

	//Act

	//Assert
	const div = container.querySelector("div")

	if(div!==null)
	{
		expect(div.classList.contains(status)).toBe(true)
	}
}
