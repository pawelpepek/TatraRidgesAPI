import Notification from "./Notification"
import { testClass, testText } from "../helpers/testHelper"

describe("Notification component", () => {
	test("when status equals error render'test' as a text", () =>
		testText({ component: getComponent() }))
	test("render error with className error", () => makeTestDiv("error"))
	test("render success with className success", () => makeTestDiv("success"))
	test("render pending with className pending", () => makeTestDiv("pending"))
})

const getComponent = (status: string = "error") => (
	<Notification status={status} message='test' />
)

const makeTestDiv = (status: string) =>
	testClass(
		{ component: getComponent(status), elementSelector: "div" },
		{ className: status, includes: true }
	)
