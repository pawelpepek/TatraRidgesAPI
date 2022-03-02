import classes from "./RouteForm.module.css"
import AdjectivSelect from "./AdjectivSelect"
import RoundButton from "../../../ui/RoundButton"
import addIcon from "../../../img/plus.svg"
import RouteInputRow from "./RouteInputRow"
import RouteSelectRow from "./RouteSelectRow"
import RouteCheckboxRow from "./RouteCheckBoxRow"
import { useSelector, useDispatch } from "react-redux"
import StoreType from "../../../../store/store-types"
import { getParameters } from "../../../../store/map-actions"
import { useEffect } from "react"
import { postRouteRidge } from "../../../../store/map-actions"
import { AddRoute } from "../../../../store/routeTypes"
import {
	getNotNullable,
	destructDifficultyValue,
} from "../../../helpers/functions"
import CheckboxRow from "../../../ui/form/CheckboxRow"

const RouteForm: React.FC<{ className?: string }> = props => {
	const dispatch = useDispatch()

	const isStarted = useSelector((state: StoreType) => state.routeForm.isRunning)

	const isValid = useSelector((state: StoreType) => state.routeForm.isFilled)

	const formValue = useSelector((state: StoreType) => state.routeForm)

	const point1 = useSelector((state: StoreType) => state.map.pointFrom)
	const point2 = useSelector((state: StoreType) => state.map.pointTo)

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault()

		const difficulty = destructDifficultyValue(formValue.difficulty)

		const newRoute: AddRoute = {
			pointId1: point1.id,
			pointId2: point2.id,
			rappeling: formValue.rappeling,
			routeTime: getNotNullable(formValue.routeTime).toString() + ":00",
			adjectives: formValue.adjectives,
			guideDescription: {
				guideId: formValue.guide,
				page: getNotNullable(formValue.page),
				volume: getNotNullable(formValue.volume),
				number: formValue.number,
			},
			routeType: formValue.routeTypeId,
			difficultyValue: difficulty.valueNumber,
			difficultySign: difficulty.sign,
		}

		dispatch(postRouteRidge(newRoute))
	}

	useEffect(() => {
		if (!isStarted) {
			dispatch(getParameters())
		}
	}, [isStarted])

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
					<RouteInputRow id='page' labelText='Strona' type='Number' />
					<RouteSelectRow id='difficulty' labelText='Trudność' />
					<RouteCheckboxRow id='rappeling' labelText='Zjazd na linie' />
					<tr>
						<td colSpan={2}>
							<AdjectivSelect />
						</td>
					</tr>
					<RouteInputRow id='routeTime' labelText='Czas' type='Time' />
					<RouteSelectRow id='routeTypeId' labelText='Rodzaj drogi' />
				</tbody>
			</table>
			<div className={classes["panel-button"]}>
				<RoundButton alt='Dodaj' imageSrc={addIcon} disabled={!isValid} />
			</div>
		</form>
	)
}

export default RouteForm
