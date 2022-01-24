import { useSelector, useDispatch } from "react-redux"

import StoreType from "../../store/store-types"
import Notification from "../ui/Notification"
import AdminPanel from "./admin-panel"
import UserPanel from "./user-panel"
import FindPanel from "./find-panel"
import classes from "./main-panel.module.css"

import NavigationPanel from "./navigation-panel"

const MainPanel: React.FC = () => {
	const notification = useSelector((state: StoreType) => state.ui.notification)
	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)

	return (
		<div className={classes.main}>
			<header>
				<h1>Granie Tatr Wysokich</h1>
			</header>
			<NavigationPanel />
			<div className={classes.panel}>
				{visiblePanel === "admin" && <AdminPanel />}
				{visiblePanel === "user" && <UserPanel />}
				{visiblePanel === "find" && <FindPanel />}
			</div>
			<Notification
				status={notification.status}
				title={notification.title}
				message={notification.message}
			/>
		</div>
	)
}

export default MainPanel
