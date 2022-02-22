import checkedIcon from "../img/checked.svg"
import unCheckedIcon from "../img/unchecked.svg"
import classes from "./OptionBox.module.css"

const OptionBox: React.FC<{
	checked: boolean
	onCheck: () => void
}> = props => {
	const icon = props.checked ? checkedIcon : unCheckedIcon
	const text = props.checked ? "Zaznaczony" : "Odznaczony"

	const clickHandler = () => {
		if (!props.checked) {
			props.onCheck()
		}
	}

	return (
		<>
			<input type='radio' checked={props.checked} className={classes.option} />
			<img
				className={classes.box}
				data-tip={text}
				src={icon}
				alt={text}
				onClick={clickHandler}
			/>
		</>
	)
}

export default OptionBox
