import usePending from "../../hooks/use-pending"
import classes from "./RoundButton.module.css"

export interface RoundButtonProps {
	idButton?: string
	alt: string
	imageSrc: string
	selected?: boolean
	disabled?: boolean
	className?: string
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const RoundButton: React.FC<RoundButtonProps> = props => {
	const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (!props.disabled && props.onClick != null) {
			props.onClick(event)
		}
	}

	const [pending, _] = usePending()

	const buttonClasses = `${classes["round-button"]} ${
		props.selected ? classes.selected : ""
	}  ${props.disabled || pending ? classes.disabled : ""} ${props.className}`

	return (
		<button
			data-tip={props.alt}
			className={buttonClasses}
			onClick={buttonClickHandler}
			id={props.idButton}>
			<img alt={props.alt} src={props.imageSrc} />
		</button>
	)
}

export default RoundButton
