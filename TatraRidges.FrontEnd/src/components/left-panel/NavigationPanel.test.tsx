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
		testElement(
			{
				component: testNavigationPanel(),
				elementSelector: "#button-logout",
				reducerName: "ui",
			},
			false
		))
	test("render component with className test", () =>
		testClass(
			{
				component: testNavigationPanel("test"),
				elementSelector: "nav",
				reducerName: "ui",
			},
			{ className: "test" }
		))
	test("initialy renders 'button-login'", () =>
		testElement(
			{
				component: testNavigationPanel(),
				elementSelector: "#button-login",
				reducerName: "ui",
			},
			true
		))
})
