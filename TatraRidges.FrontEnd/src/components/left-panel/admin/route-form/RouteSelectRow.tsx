import { useDispatch, useSelector } from "react-redux"
import { getPropertyValue } from "../../../../store/filler"
import { routeFormActions } from "../../../../store/route-form-slice"
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

	const parameters = useSelector(
		(state: StoreType) => state.routeForm.containerValues
	)

	const versions = parameters.guides.map(g => {
		return {
			value: g.id.toString(),
			text: g.shortName,
		}
	})

	const difficulties = parameters.difficulties.map(d => {
		return {
			value: d.value.toString(),
			text: d.text,
		}
	})
	const types = parameters.routeTypes.map(t => {
		return {
			value: t.id.toString(),
			text: t.name,
		}
	})

	const allOptions = new Map<string, Options[]>()

	allOptions.set("guide", versions)
	allOptions.set("difficulty", difficulties)
	allOptions.set("routeTypeId", types)

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
