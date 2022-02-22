import classes from "./LiContainer.module.css"


const LiContainer: React.FC<{ key: number }> = props => {
	return (
		<li className={classes.container} key={props.key}>
			{props.children}
		</li>
	)
}

export default LiContainer
