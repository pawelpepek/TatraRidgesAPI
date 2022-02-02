import classes from "./InputRow.module.css"

interface InputRowProps {
	id: string
	labelText: string
	type: string
	value?: any
	onChange(e: React.FormEvent<HTMLInputElement>): void
}

const InputRow: React.FC<InputRowProps> = props => {
	return (
		<tr>
			<td>
				<label htmlFor={props.id}>{props.labelText}</label>
			</td>
			<td>
				<input
					className={classes.input}
					name={props.id}
					id={props.id}
					type={props.type}
					value={props.value!==null?props.value:""}
					onChange={props.onChange}
				/>
			</td>
		</tr>
	)
}

export default InputRow
