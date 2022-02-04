import classes from "./Description.module.css"

const Description: React.FC<{ text: string }> = props => {
	return <h4 className={classes.description}>{props.text}</h4>
}

export default Description
