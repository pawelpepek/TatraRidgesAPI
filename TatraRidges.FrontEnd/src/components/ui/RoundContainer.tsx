import classes from "./RoundContainer.module.css"

const RoundContainer: React.FC<{className:string}> = props => {

	return (
		<div className={`${classes.container} ${props.className}`}>
			{props.children}
		</div>
	)
}

export default RoundContainer
