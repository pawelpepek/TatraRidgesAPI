import classes from "./RoundContainer.module.css"

const RoundContainer: React.FC = props => {

	return (
		<div className={classes.container}>
			{props.children}
		</div>
	)
}

export default RoundContainer
