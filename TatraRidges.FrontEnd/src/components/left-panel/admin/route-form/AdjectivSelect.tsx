import Select from "react-select"
import {
	OptionsProps,
	routeFormActions,
} from "../../../../store/route-form-slice"
import { useSelector, useDispatch } from "react-redux"
import classes from "./AdjectivSelect.module.css"
import StoreType from "../../../../store/store-types"

const AdjectivSelect: React.FC = () => {
	const dispatch = useDispatch()

	const selected = useSelector((state: StoreType) => state.routeForm.adjectives)

	const onChange = (option: readonly OptionsProps[]) => {
		const options = [...option].map(o => o.value)
		const payload = {
			name: "adjectives",
			value: options,
		}

		dispatch(routeFormActions.setValue(payload))
	}

	const options2 = [
		{ value: "_p", label: "Piękna" },
		{ value: "bp", label: "Bardzo piękna" },
		{ value: "_k", label: "Krucha" },
	]

	const selectedOptions = options2.filter(o => selected.includes(o.value))

	return (
		<>
			<label htmlFor='adjectives'>Dodatkowe określenia drogi:</label>
			<Select
				id='adjectives'
				className={classes.select}
				isMulti={true}
				defaultValue={selectedOptions}
				value={selectedOptions}
				onChange={onChange}
				options={options2}
			/>
		</>
	)
}

export default AdjectivSelect
