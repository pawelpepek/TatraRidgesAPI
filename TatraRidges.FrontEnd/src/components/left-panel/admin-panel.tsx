import { useSelector, useDispatch } from "react-redux"

import { postConnectionRidge } from "../../store/map-actions"

import StoreType from "../../store/store-types"
import PointsPanel from "./points-panel"
import NoLocationMarks from "./no-location-marks"
import RoundButton from "../ui/round-button"
import linkIcon from "../img/link.svg"
import RouteForm from './route-form'
import classes from "./admin-panel.module.css"

const AdminPanel: React.FC = () => {
	const dispatch = useDispatch()

	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	const clickConnectHandler = () =>
		dispatch(postConnectionRidge(pointFrom.id, pointTo.id))

	return (
		<>
			<PointsPanel deleteVisible={true} />
			<h2>Panel administratora</h2>
			<RoundButton
				imageSrc={linkIcon}
				alt='Połacz punkty'
				onClick={clickConnectHandler}
			/>
			<RoundButton
				imageSrc={linkIcon}
				alt='Połacz punkty'
				onClick={clickConnectHandler}
			/>
			<div>
				<NoLocationMarks />
			</div>
		</>
	)
}

export default AdminPanel
