import { useDispatch, useSelector } from "react-redux"
import CheckboxRow from "../../../ui/form/CheckboxRow"
import { routeFormActions } from "../../../../store/route-form-slice"
import StoreType from "../../../../store/store-types"
import { getPropertyValue } from "../../../../store/filler"

interface RouteCheckboxRowProps {
	id: string
	labelText: string
}

const RouteCheckboxRow: React.FC<RouteCheckboxRowProps> = props => {
	const value = useSelector((state: StoreType) =>
		getPropertyValue(state.routeForm, props.id)
	)
	const dispatch = useDispatch()

	const onChange = (e: React.FormEvent<HTMLInputElement>) => {
		const value = e.currentTarget.checked
		const payload = {
			name: props.id,
			value,
		}

		dispatch(routeFormActions.setValue(payload))
	}

	const id = `routeForm${props.id}`
	return (
		<CheckboxRow
			id={id}
			labelText={props.labelText}
			onChange={onChange}
            value={value}
		/>
	)
}

export default RouteCheckboxRow
