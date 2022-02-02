import classes from "./PanelHeader.module.css"

const PanelHeader: React.FC<{ text: string }> = props => {
	return <h2 className={classes.header}>{props.text}</h2>
}

export default PanelHeader
