import routeIcon from "../../img/route.svg"
import noLocationIcon from "../../img/no-location-mark.svg"
import classes from "./admin-navigation-panel.module.css"
import ConnectButton from "./connect-button"
import AdminNavigationButton from "./admin-navigation-button"

const AdminNavigationPanel: React.FC = () => {
	return (
		<div className={classes["buttons"]}>
			<AdminNavigationButton
				name='noLocation'
				imageSrc={noLocationIcon}
				alt='Punkty bez lokalizacji'
			/>
			<AdminNavigationButton
				name='route'
				imageSrc={routeIcon}
				alt='Dodaj drogę'
			/>
			<ConnectButton />
		</div>
	)
}

export default AdminNavigationPanel
