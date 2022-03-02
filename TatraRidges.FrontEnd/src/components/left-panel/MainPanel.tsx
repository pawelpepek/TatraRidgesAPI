import { useSelector } from "react-redux"

import StoreType from "../../store/store-types"
import Notification from "../ui/Notification"
import classes from "./MainPanel.module.css"
import MainFunctions from "./MainFunctions"

const MainPanel: React.FC = () => {
	const notification = useSelector((state: StoreType) => state.ui.notification)
	const isRoute=useSelector((state: StoreType) => state.ui.isRouteVisible)

	let className=`${classes.main} ${isRoute?classes.maxHeight:""}`

	return (
		<div className={className}>
			<MainFunctions />
			{!isRoute && <Notification
				status={notification.status}
				message={notification.message}
			/>}
		</div>
	)
}

export default MainPanel
