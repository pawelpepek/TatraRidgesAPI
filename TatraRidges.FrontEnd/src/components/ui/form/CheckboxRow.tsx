interface CheckBoxRowProps {
	id: string
	labelText: string
	value?: boolean
	onChange(e: React.FormEvent<HTMLInputElement>): void
}

const CheckBoxRow: React.FC<CheckBoxRowProps> = props => {
	return (
		<tr>
			<td>
				<label htmlFor={props.id}>{props.labelText}</label>
			</td>
			<td>
				<input
					id={props.id}
					type={"checkbox"}
					checked={props.value === true}
					onChange={props.onChange}
				/>
			</td>
		</tr>
	)
}

export default CheckBoxRow
