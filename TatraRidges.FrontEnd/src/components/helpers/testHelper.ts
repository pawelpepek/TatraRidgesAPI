import userEvent from "@testing-library/user-event"
import React from "react"
import { renderWithInitialReducer } from "./testRedux"
import testerModel from "./tester"

export const testText = (
	component: React.ReactElement,
	text: string = "test"
) => {
	//Arrange
	const tester = new testerModel(component)

	//Act

	//Assert
	tester.findElementByText(text)
	tester.checkIsElementInDocument()
}

export const testClass = (
	component: React.ReactElement,
	elementName: string,
	className: string,
	isInClasses: boolean = true
) => {
	//Arrange
	const tester = new testerModel(component, "ui")

	//Assert
	tester.findElement(elementName)
	tester.checkIfElementHasClass(className)?.toBe(isInClasses)
}

export const testElement = (
	component: React.ReactElement,
	elementSelector: string,
	visible: boolean = true
) => {
	//Arrange
	const tester = new testerModel(component, "ui")

	//Assert
	tester.findElement(elementSelector)
	tester.checkIsElementInDocument(visible)
}

export const testClickElement = (
	component: React.ReactElement,
	elementClickedSelector: string,
	elementSearchedSelector: string
) => {
	//Arrange
	const { container } = renderWithInitialReducer(component, "ui")
	const elementClicked = container.querySelector(elementClickedSelector)

	//Act
	if (elementClicked !== null) {
		userEvent.click(elementClicked)
	}
	//Assert
	expect(elementClicked).not.toBeNull()
	const elementSearched = container.querySelector(elementSearchedSelector)
	expect(elementSearched).not.toBeNull()
	expect(elementSearched).toBeInTheDocument()
}

export const testClickElements = (
	component: React.ReactElement,
	elementsClickedSelectors: string[],
	elementSearchedSelector: string
) => {
	//Arrange
	const tester = new testerModel(component, "ui")

	//Act
	for (const selector of elementsClickedSelectors) {
		tester.findElement(selector)
		tester.checkIsElementInDocument()
		tester.clickElement()
	}

	//Assert
	tester.findElement(elementSearchedSelector)
	tester.checkIsElementInDocument()
}
