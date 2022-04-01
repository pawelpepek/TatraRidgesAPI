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
