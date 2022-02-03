import Description from "./Description"
import { testText } from "../../helpers/testHelper"

describe("Description component", () => {
	test("render 'test' as a text", () =>
		testText({ component: <Description text={"test"} /> }))
})
