interface CheckBoxRowProps {
	id: string
	labelText: string
}

const CheckBoxRow: React.FC<CheckBoxRowProps> = props => {
	return (
		<tr>
			<td>
				<label htmlFor={props.id}>{props.labelText}</label>
			</td>
			<td>
				<input id={props.id} type={"checkbox"} />
			</td>
		</tr>
	)
}

export default CheckBoxRow
