import routeIcon from "../../img/route.svg"
import noLocationIcon from "../../img/no-location-mark.svg"
import classes from "./AdminNavigationPanel.module.css"
import ConnectButton from "./ConnectButton"
import AdminNavigationButton from "./AdminNavigationButton"

const AdminNavigationPanel: React.FC = () => {
	return (
		<div className={classes["buttons"]}>
			<AdminNavigationButton
				name='route'
				imageSrc={routeIcon}
				alt='Dodaj drogę'
			/>
			<AdminNavigationButton
				name='noLocation'
				imageSrc={noLocationIcon}
				alt='Punkty bez lokalizacji'
			/>
			<ConnectButton />
		</div>
	)
}

export default AdminNavigationPanel
