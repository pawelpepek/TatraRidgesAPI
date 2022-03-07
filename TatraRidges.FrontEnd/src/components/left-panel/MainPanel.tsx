import { useSelector } from "react-redux"

import StoreType from "../../store/store-types"
import Notification from "../ui/Notification"
import classes from "./MainPanel.module.css"
import MainFunctions from "./MainFunctions"

const MainPanel: React.FC = () => {
	const errorMessage = useSelector((state: StoreType) =>
		state.ui.notification.status == "error" ? state.ui.notification.message : ""
	)
	const isRoute = useSelector((state: StoreType) => state.ui.isRouteVisible)

	let className = `${classes.main} ${isRoute ? classes.maxHeight : ""}`

	return (
		<div className={className}>
			<MainFunctions />
			{!isRoute && errorMessage !== "" && (
				<Notification status='error' message={errorMessage} />
			)}
		</div>
	)
}

export default MainPanel
