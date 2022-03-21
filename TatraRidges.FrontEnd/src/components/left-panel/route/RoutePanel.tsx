import { useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import Tooltip from "../../ui/Tooltip"
import RouteAllInfoPanel from "./RouteAllInfoPanel"
import RouteHeader from "./RouteHeader"
import AlternativeRoutesTab from "./alternative/AlternativeRoutesTab"
import { MountainPoint } from "../../types"
import { RidgeWithRoutes } from "../../../store/routeTypes"
import classes from "./RoutePanel.module.css"

const RoutePanel: React.FC = () => {
	const ridgeInfo = useSelector((state: StoreType) => state.map.ridgeInfo)
	const visibleRoutePart = useSelector(
		(state: StoreType) => state.ui.selectedRoutePart
	)
	const isMapVisible=useSelector((state: StoreType) => state.ui.visiblePanel==="route-map")

	const alternative = visibleRoutePart >= 0
	const backVersion = alternative ? "main" : "search"
	const backText = alternative ? "Wróć do tras" : "Wróć do wyszukiwania"

	const getRoutes = () => {
		const result = ridgeInfo.ridgesContainer.find(
			r => r.pointsConnectionId === visibleRoutePart
		)
		const routes: RidgeWithRoutes =
			result !== undefined ? result : ({} as RidgeWithRoutes)
		return routes
	}
	const getPoint1 = () => getRoutes().point1 as MountainPoint
	const getPoint2 = () => getRoutes().point2 as MountainPoint

	const header = alternative ? "Wybór wariantu" : "Wynik wyszukiwania"

	const classForInfo=alternative?classes.hide:"";

	return (
		<>
			<RouteHeader
				backVersion={backVersion}
				backText={backText}
				header={header}
			/>
			<RouteAllInfoPanel route={ridgeInfo} className={classForInfo}/>
			{alternative && (
				<AlternativeRoutesTab
					routes={getRoutes().routes}
					selectedId={getRoutes().selectedId}
					point1={getPoint1()}
					point2={getPoint2()}
				/>
			)}
			<Tooltip />
		</>
	)
}

export default RoutePanel
