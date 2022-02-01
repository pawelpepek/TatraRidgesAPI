import classes from "./SelectRow.module.css"

interface SelectRowProps {
	id: string
	labelText: string
	options: { value: string; text: string }[]
}

const SelectRow: React.FC<SelectRowProps> = props => {
	return (
		<tr>
			<td>
				<label htmlFor={props.id}>{props.labelText}</label>
			</td>
			<td>
				<select className={classes.select} name={props.id} id={props.id}>
					{props.options.map(o => (
						<option value={o.value}>{o.text}</option>
					))}
				</select>
			</td>
		</tr>
	)
}

export default SelectRow
