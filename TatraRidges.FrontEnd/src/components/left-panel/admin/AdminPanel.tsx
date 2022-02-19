import { useSelector } from "react-redux"

import StoreType from "../../../store/store-types"
import PointsPanel from "../points/PointsPanel"
import NoLocationMarks from "./NoLocationMarks"
import PanelHeader from "../PanelHeader"
import RouteAddPanel from "./route-form/RouteAddPanel"
import classes from "./AdminPanel.module.css"
import AdminNavigationPanel from "./AdminNavigationPanel"
import Tooltip from "../../ui/Tooltip"

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
				{partVisible === "route" && <RouteAddPanel />}
				{partVisible === "noLocation" && <NoLocationMarks />}
			</div>
			<Tooltip/>
		</>
	)
}

export default AdminPanel
