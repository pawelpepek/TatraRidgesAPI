import classes from "./LiContainer.module.css"


const LiContainer: React.FC = props => {
	return (
		<li className={classes.container}>
			{props.children}
		</li>
	)
}

export default LiContainer
