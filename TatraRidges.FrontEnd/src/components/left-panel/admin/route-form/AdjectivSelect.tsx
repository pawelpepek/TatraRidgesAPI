import Select from "react-select"
import {
	OptionsProps,
	routeFormActions,
} from "../../../../store/route-form-slice"
import { useSelector, useDispatch } from "react-redux"
import classes from "./AdjectivSelect.module.css"
import StoreType from "../../../../store/store-types"
import { Adjective } from "../../../../store/routeTypes"

const AdjectivSelect: React.FC = () => {
	const dispatch = useDispatch()

	const selected = useSelector((state: StoreType) => state.routeForm.adjectives)
	const adjectives = useSelector(
		(state: StoreType) => state.routeForm.containerValues.adjectives
	)

	const onChange = (option: readonly OptionsProps[]) => {
		const options = [...option].map(o => o.value)
		const payload = {
			name: "adjectives",
			value: options,
		}

		dispatch(routeFormActions.setValue(payload))
	}

	const selectedGroup = selected.map(a => a.substring(1))

	const adjectiveSelectedOrNotSimilar = (a: Adjective) =>
		!selectedGroup.includes(a.id.substring(1)) || selected.includes(a.id)

	const options2 = adjectives.filter(adjectiveSelectedOrNotSimilar).map(a => {
		return {
			value: a.id,
			label: a.text,
		}
	})

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
