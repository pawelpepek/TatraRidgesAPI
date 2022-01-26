import { useSelector } from "react-redux"

import StoreType from "../../../store/store-types"
import PointsPanel from "../points/points-panel"
import NoLocationMarks from "./no-location-marks"
import PanelHeader from "../panel-header"
import RouteForm from "./route-form"
import classes from "./admin-panel.module.css"
import AdminNavigationPanel from "./admin-navigation-panel"

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
				{partVisible === "noLocation" && <NoLocationMarks />}
				{partVisible === "route" && <RouteForm />}
			</div>
		</>
	)
}

export default AdminPanel
