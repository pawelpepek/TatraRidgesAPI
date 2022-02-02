import classes from "./RouteForm.module.css"
import AdjectivSelect from "./AdjectivSelect"
import RoundButton from "../../../ui/RoundButton"
import addIcon from "../../../img/plus.svg"
import RouteInputRow from "./RouteInputRow"
import RouteSelectRow from "./RouteSelectRow"
import RouteCheckboxRow from "./RouteCheckBoxRow"
import { useSelector, useDispatch } from "react-redux"
import StoreType from "../../../../store/store-types"
import { routeFormActions } from "../../../../store/route-form-slice"

const RouteForm: React.FC<{ className?: string }> = props => {
    const dispatch=useDispatch()

	const isValid = useSelector((state: StoreType) => state.routeForm.isFilled)

    const formValue = useSelector((state: StoreType) => state.routeForm)

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault()
        console.log(formValue)
        dispatch(routeFormActions.clear(null))
	}

	return (
		<form onSubmit={submitHandler}>
			<table className={classes.table}>
				<thead>
					<tr>
						<th style={{ width: "40%" }}></th>
						<th style={{ width: "60%" }}></th>
					</tr>
				</thead>
				<tbody>
					<RouteCheckboxRow id='consistentDirection' labelText='Odwrotnie' />
					<RouteSelectRow id='guide' labelText='Przewodnik' />
					<RouteInputRow id='volume' labelText='Tom' type='Number' />
					<RouteInputRow id='number' labelText='Numer' type='Text' />
					<RouteSelectRow id='difficulty' labelText='Trudność' />
					<tr>
						<td colSpan={2}>
							<AdjectivSelect />
						</td>
					</tr>
					<RouteInputRow id='routeTime' labelText='Czas' type='Time' />
					<RouteSelectRow id='routeType' labelText='Rodzaj drogi' />
					<RouteCheckboxRow id='rappeling' labelText='Zjazd na linie' />
					<RouteInputRow id='page' labelText='Strona' type='Number' />
				</tbody>
			</table>
			<RoundButton alt='Dodaj' imageSrc={addIcon} disabled={!isValid} />
		</form>
	)
}

export default RouteForm
