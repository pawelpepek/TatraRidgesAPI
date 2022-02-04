import { testText } from "../../helpers/testHelper"
import CheckBoxRow from "./CheckboxRow"

const component = (
	<CheckBoxRow labelText='test' onChange={() => {}} id='testCh' />
)

describe("CheckboxRow component", () => {
	test("render Test as label text", () => testText({ component }))
})
