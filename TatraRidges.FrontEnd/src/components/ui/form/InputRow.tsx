import classes from './InputRow.module.css'

interface InputRowProps {
	id: string
	labelText: string
	type: string
}

const InputRow: React.FC<InputRowProps> = props => {
	return (
		<tr>
			<td>
				<label htmlFor={props.id}>{props.labelText}</label>
			</td>
			<td>
				<input className={classes.input} name={props.id} id={props.id} type={props.type} />
			</td>
		</tr>
	)
}

export default InputRow
