import linkIcon from "../../img/connection.svg"
import routeIcon from "../../img/route.svg"
import noLocationIcon from "../../img/no-location-mark.svg"

import classes from "./admin-navigation-panel.module.css"

import RoundButton from "../../ui/round-button"

const AdminNavigationPanel: React.FC = () => {
	const clickConnectHandler = () => {
		// dispatch(postConnectionRidge(pointFrom.id, pointTo.id))
	}

	return (
		<div className={classes["buttons"]}>
			<RoundButton
				imageSrc={noLocationIcon}
				alt='Punkty bez lokalizacji'
				onClick={clickConnectHandler}
			/>
			<RoundButton
				imageSrc={routeIcon}
				alt='Dodaj drogę'
				onClick={clickConnectHandler}
			/>
			<RoundButton
				className={classes.connection}
				imageSrc={linkIcon}
				alt='Połacz punkty'
				onClick={clickConnectHandler}
			/>
		</div>
	)
}

export default AdminNavigationPanel
