import { useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import Tooltip from "../../ui/Tooltip"
import RouteAllInfoPanel from "./RouteAllInfoPanel"
import RouteHeader from "./RouteHeader"
import AlternativeRoutesTab from "./alternative/AlternativeRoutesTab"
import { MountainPoint } from "../../types"
import { RidgeWithRoutes } from "../../../store/routeTypes"

const RoutePanel: React.FC = () => {
	const ridgeInfo = useSelector((state: StoreType) => state.map.ridgeInfo)
	const visibleRoutePart = useSelector(
		(state: StoreType) => state.ui.selectedRoutePart
	)

	const alternative = visibleRoutePart >= 0

	console.log(visibleRoutePart)

	const backVersion = alternative ? "main" : "search"
	const backText = alternative ? "Wróć do wyszukiwania" : "Wróć do tras"

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

	return (
		<>
			<RouteHeader
				backVersion={backVersion}
				backText={backText}
				header={header}
			/>
			{!alternative && <RouteAllInfoPanel route={ridgeInfo} />}
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
