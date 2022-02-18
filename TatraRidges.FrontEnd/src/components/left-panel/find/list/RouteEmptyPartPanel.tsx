import FirstInfoLabel from "../info/FirstInfoLabel"
import classes from "./RouteEmptyPartPanel.module.css"

const RouteEmptyPartPanel: React.FC = () => {
	return (
		<p className={classes.warning}>Brak opisu dla tego połączenia!</p>
	)
}

export default RouteEmptyPartPanel
