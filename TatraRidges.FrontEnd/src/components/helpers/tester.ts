import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import { renderWithInitialReducer } from "./testRedux"

class tester {
	readonly reducerName: string
	readonly container: HTMLElement
	readonly component: React.ReactElement
	element!: Element | null

	constructor(component: React.ReactElement, reducerName: string = "") {
		this.reducerName = reducerName
		this.component = component

		const { container } =
			reducerName !== "" && reducerName !== undefined
				? renderWithInitialReducer(component, reducerName)
				: render(component)

		this.container = container
	}

	findElement(elementSelector: string) {
		this.element = this.container.querySelector(elementSelector)
		return this.element
	}

	findElementByText(text: string) {
		this.element = screen.getByText(text, { exact: false })
		return this.element
	}

	checkIsElementInDocument(visible = true) {
		const exp = expect(this.element)
		if (visible) {
			exp.not.toBeNull()
			exp.toBeInTheDocument()
		} else {
			exp.toBeNull()
		}
	}

	checkIfElementHasClass(className: string) {
		this.checkIsElementInDocument()
		if (this.element !== null) {
			return expect(this.element.classList.contains(className))
		}
		return null
	}

	clickElement() {
		this.checkIsElementInDocument()
		if (this.element !== null) {
			userEvent.click(this.element)
		}
	}
}

export default tester
