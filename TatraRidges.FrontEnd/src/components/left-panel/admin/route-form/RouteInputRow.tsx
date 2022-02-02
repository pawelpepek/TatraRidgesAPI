import { useDispatch, useSelector } from "react-redux"
import InputRow from "../../../ui/form/InputRow"
import { routeFormActions } from "../../../../store/route-form-slice"
import StoreType from "../../../../store/store-types"
import { getPropertyValue } from "../../../../store/filler"

interface RouteInputRowProps {
	id: string
	labelText: string
	type: string
}

const RouteInputRow: React.FC<RouteInputRowProps> = props => {
	const value = useSelector((state: StoreType) =>
		getPropertyValue(state.routeForm, props.id)
	)
	const dispatch = useDispatch()

	const onChange = (e: React.FormEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value

		const payload = {
			name: props.id,
			value,
		}

		dispatch(routeFormActions.setValue(payload))
	}

	const id = `routeForm${props.id}`
	return (
		<InputRow
			id={id}
			labelText={props.labelText}
			type={props.type}
			onChange={onChange}
            value={value}
		/>
	)
}

export default RouteInputRow
