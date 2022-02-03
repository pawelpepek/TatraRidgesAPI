import userEvent from "@testing-library/user-event"
import React from "react"
import { renderWithInitialReducer } from "./testRedux"
import testerModel from "./tester"

export interface ComponentConfiguration extends ComponentBasicConfiguration {
	elementSelector: string
}

export interface ComponentBasicConfiguration {
	component: React.ReactElement
	reducerName?: string
}

export interface ClassConfiguration {
	className: string
	includes?: boolean
}

export const testText = (
	componentConfiguration: ComponentBasicConfiguration,
	text: string = "test"
) => {
	//Arrange
	const tester = getTester(componentConfiguration)

	//Act

	//Assert
	tester.findElementByText(text)
	tester.checkIsElementInDocument()
}

export const testClass = (
	componentConfiguration: ComponentConfiguration,
	classConfiguration: ClassConfiguration
) => {
	//Arrange
	const tester = new testerModel(
		componentConfiguration.component,
		componentConfiguration.reducerName
	)

	const isInClasses = getBoolean(classConfiguration.includes)

	//Assert
	tester.findElement(componentConfiguration.elementSelector)
	tester.checkIfElementHasClass(classConfiguration.className)?.toBe(isInClasses)
}

export const testElement = (
	componentConfiguration: ComponentConfiguration,
	visible: boolean = true
) => {
	//Arrange
	const tester = new testerModel(
		componentConfiguration.component,
		componentConfiguration.reducerName
	)

	//Assert
	tester.findElement(componentConfiguration.elementSelector)
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

const getBoolean = (value: boolean | undefined) =>
	value === undefined ? true : value

const getTester = (componentConfiguration: ComponentBasicConfiguration) => {
	return new testerModel(
		componentConfiguration.component,
		componentConfiguration.reducerName
	)
}
