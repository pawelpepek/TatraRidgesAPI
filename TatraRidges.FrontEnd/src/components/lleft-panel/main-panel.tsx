import { useSelector } from "react-redux"
import StoreType from "../../store/store-types"
import Notification from "../ui/Notification"
import AdminPanel from "./admin-panel"

const MainPanel: React.FC = () => {
	const notification = useSelector((state: StoreType) => state.ui.notification)

	return (
		<div className='left-panel'>
			<AdminPanel />
			<Notification
				status={notification.status}
				title={notification.title}
				message={notification.message}
			/>
		</div>
	)
}

export default MainPanel
