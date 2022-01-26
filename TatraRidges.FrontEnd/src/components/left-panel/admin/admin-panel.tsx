import { useSelector, useDispatch } from "react-redux"

import { postConnectionRidge } from "../../../store/map-actions"
import StoreType from "../../../store/store-types"
import PointsPanel from "../points/points-panel"
import NoLocationMarks from "./no-location-marks"
import PanelHeader from "../panel-header"
import RouteForm from "./route-form"
import classes from "./admin-panel.module.css"
import AdminNavigationPanel from "./admin-navigation-panel"

const AdminPanel: React.FC = () => {
	const dispatch = useDispatch()

	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)



	return (
		<>
			<PanelHeader text='Panel administratora' />
			<PointsPanel deleteVisible={true} />
			<div className={classes["manage-panel"]}>

				<AdminNavigationPanel/>
				<NoLocationMarks />
				{/* <RouteForm/> */}
			</div>
		</>
	)
}

export default AdminPanel
