import classes from "./LiContainer.module.css"


const LiContainer: React.FC= props => {
	return (
		<li>
			{props.children}
		</li>
	)
}

export default LiContainer
