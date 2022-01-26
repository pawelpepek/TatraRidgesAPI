import { useSelector } from "react-redux"

import StoreType from "../../store/store-types"
import Notification from "../ui/Notification"
import classes from "./main-panel.module.css"
import MainFunctions from "./main-functions"

const MainPanel: React.FC = () => {
	const notification = useSelector((state: StoreType) => state.ui.notification)

	return (
		<div className={classes.main}>
			<MainFunctions />
			<Notification
				status={notification.status}
				title={notification.title}
				message={notification.message}
			/>
		</div>
	)
}

export default MainPanel
