import { render, screen } from "@testing-library/react"
import React from "react"

export const testText = (
	component: React.ReactElement,
	text: string = "test"
) => {
	//Arrange
	render(component)

	//Act

	//Assert
	const element = screen.getByText(text, { exact: false })
	expect(element).not.toBeNull()
	expect(element).toBeInTheDocument()
}

export const testClass = (
	component: React.ReactElement,
	elementName: string,
	className: string,
	isInClasses: boolean = true
) => {
	//Assert
	const element = getElement(component, elementName)
	expect(element).not.toBeNull()
	if (element !== null) {
		expect(element.classList.contains(className)).toBe(isInClasses)
	}
}

export const testElement = (
	component: React.ReactElement,
	elementName: string,
	visible: boolean
) => {
	//Assert
	const element = getElement(component, elementName)
	if (visible) {
		// expect(element).not.toBeNull()
		if (element !== null) {
			expect(element).toBeInTheDocument()
		} else {
			expect(element).not.toBeNull()
		}
	} else {
		expect(element).toBeNull()
	}
}

const getElement = (component: React.ReactElement, elementName: string) => {
	//Arrange
	const { container } = render(component)

	//Act

	//Assert
	return container.querySelector(elementName)
}
