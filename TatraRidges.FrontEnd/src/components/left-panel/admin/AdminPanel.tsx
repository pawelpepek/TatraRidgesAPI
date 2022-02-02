import { useSelector } from "react-redux"

import StoreType from "../../../store/store-types"
import PointsPanel from "../points/PointsPanel"
import NoLocationMarks from "./NoLocationMarks"
import PanelHeader from "../PanelHeader"
import RoutePanel from "./route-form/RoutePanel"
import classes from "./AdminPanel.module.css"
import AdminNavigationPanel from "./AdminNavigationPanel"

const AdminPanel: React.FC = () => {
	const partVisible = useSelector(
		(state: StoreType) => state.ui.visibleAdminPart
	)

	return (
		<>
			<PanelHeader text='Panel administratora' />
			<PointsPanel deleteVisible={true} />
			<div className={classes["manage-panel"]}>
				<AdminNavigationPanel />
				{partVisible === "route" && <RoutePanel />}
				{partVisible === "noLocation" && <NoLocationMarks/>}
			</div>
		</>
	)
}

export default AdminPanel
