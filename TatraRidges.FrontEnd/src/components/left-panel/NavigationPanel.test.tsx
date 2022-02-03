import React from "react"
import NavigationPanel from "./NavigationPanel"
import {
	testClass,
	testClickElements,
	testElement,
} from "../helpers/testHelper"

const testNavigationPanel = (className: string = "") => {
	return <NavigationPanel className={className} />
}

describe("NavigationPanel component", () => {
	test("renders 'button-logout' if 'button-login' is clicked", () =>
		testClickElements(
			testNavigationPanel(),
			["#button-login"],
			"#button-logout"
		))
	test("renders 'button-login' if 'button-logout' is clicked", () =>
		testClickElements(
			testNavigationPanel(),
			["#button-login", "#button-logout"],
			"#button-login"
		))
	test("initialy not renders 'button-logout'", () =>
		testElement(testNavigationPanel(), "#button-logout", false))
	test("render component with className test", () =>
		testClass(testNavigationPanel("test"), "nav", "test"))
	test("initialy renders 'button-login'", () =>
		testElement(testNavigationPanel(), "#button-login", true))
})
