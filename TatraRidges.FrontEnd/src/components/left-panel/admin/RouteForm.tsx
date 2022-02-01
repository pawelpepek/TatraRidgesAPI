import Description from "./description"
import classes from "./RouteForm.module.css"
import CheckBoxRow from "../../ui/form/CheckboxRow"
import SelectRow from "../../ui/form/SelectRow"
import InputRow from "../../ui/form/InputRow"

const RouteForm: React.FC<{ className?: string }> = props => {
	const options = [
		{ value: "WHP", text: "WHP" },
		{ value: "WC", text: "WC" },
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
		{ value: "0", text: "Ściśle granią" },
		{ value: "1", text: "Prawie ściśle granią" },
		{ value: "2", text: "Obchodząc grań" },
	]

	const options2 = [
		{ value: "chocolate", label: "Chocolate" },
		{ value: "strawberry", label: "Strawberry" },
		{ value: "vanilla", label: "Vanilla" },
	]

	return (
		<div className={props.className}>
			<Description text='Dodawanie drogi' />
			<form>
				<table className={classes.table}>
					<thead>
						<tr>
							<th style={{ width: "40%" }}></th>
							<th style={{ width: "60%" }}></th>
						</tr>
					</thead>
					<tbody>
						<CheckBoxRow id='consistentDirection' labelText='Odwrotnie' />
						<SelectRow id='rGuide' labelText='Przewodnik' options={options} />
						<InputRow id='gVolume' labelText='Tom' type='Number' />
						<InputRow id='gNumber' labelText='Numer' type='Text' />
						<InputRow id='gPage' labelText='Strona' type='Number' />
						<SelectRow
							id='rDifficulties'
							labelText='Trudność'
							options={difficulties}
						/>
						<CheckBoxRow id='rappeling' labelText='Zjazd na linie' />
						<SelectRow id='rtype' labelText='Rodzaj drogi' 
						options={types} />
					</tbody>
				</table>
			</form>
			<button>Dodaj</button>
		</div>
	)
}

export default RouteForm
