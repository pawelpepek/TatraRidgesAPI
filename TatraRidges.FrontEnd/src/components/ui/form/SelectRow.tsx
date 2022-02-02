import classes from "./SelectRow.module.css"

interface SelectRowProps {
	id: string
	labelText: string
	options: { value: string; text: string }[]
	value?:any
	onChange(e: React.FormEvent<HTMLSelectElement>): void
}

const SelectRow: React.FC<SelectRowProps> = props => {
	return (
		<tr>
			<td>
				<label htmlFor={props.id}>{props.labelText}</label>
			</td>
			<td>
				<select
					className={classes.select}
					name={props.id}
					id={props.id}
					onChange={props.onChange}
					value={props.value}>
					{props.options.map(o => (
						<option value={o.value}>{o.text}</option>
					))}
				</select>
			</td>
		</tr>
	)
}

export default SelectRow
