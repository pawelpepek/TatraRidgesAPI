import classes from "./panel-header.module.css"

const PanelHeader: React.FC<{ text: string }> = props => {
	return <h2 className={classes.header}>{props.text}</h2>
}

export default PanelHeader
