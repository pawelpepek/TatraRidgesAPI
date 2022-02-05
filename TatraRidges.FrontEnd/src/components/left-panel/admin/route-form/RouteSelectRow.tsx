import { useDispatch, useSelector } from "react-redux"
import { getPropertyValue } from "../../../../store/filler"
import {routeFormActions,} from "../../../../store/route-form-slice"
import StoreType from "../../../../store/store-types"
import SelectRow from "../../../ui/form/SelectRow"

interface RouteSelectRowProps {
	id: string
	labelText: string
}
interface Options {
	value: string
	text: string
}

const RouteSelectRow: React.FC<RouteSelectRowProps> = props => {
	const dispatch = useDispatch()
	const selectedOptions = useSelector((state: StoreType) =>
		getPropertyValue(state.routeForm, props.id)
	)
	const versions = [
		{ value: "1", text: "WHP" },
		{ value: "2", text: "WC" },
	]

	const difficulties = [
		{ value: "0-", text: "0-" },
		{ value: "0", text: "0" },
		{ value: "0+", text: "0+" },
		{ value: "I", text: "I" },
		{ value: "II", text: "II" },
		{ value: "III", text: "III" },
	]

	const types = [
		{ value: "1", text: "Ściśle granią" },
		{ value: "2", text: "Prawie ściśle granią" },
		{ value: "3", text: "Obchodząc grań" },
	]

	const allOptions = new Map<string, Options[]>()

	
	allOptions.set("guide", versions)
	allOptions.set("difficulty", difficulties)
	allOptions.set("routeType", types)

	const id = `routeForm${props.id}`

	let options: Options[] = []

	const optionsUndefinned = allOptions.get(props.id)
	if (optionsUndefinned !== undefined) {
		options = optionsUndefinned
	}

	const onChange = (e: React.FormEvent<HTMLSelectElement>) => {
		const value = e.currentTarget.value

		const payload = {
			name: props.id,
			value,
		}

		dispatch(routeFormActions.setValue(payload))
	}

	return (
		<SelectRow
			id={id}
			labelText={props.labelText}
			options={options}
			onChange={onChange}
            value={selectedOptions}
		/>
	)
}

export default RouteSelectRow
