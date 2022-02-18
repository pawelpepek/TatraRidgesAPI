import { useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import RouteAllInfoPanel from "../find/RouteAllInfoPanel"

const RoutePanel: React.FC = () => {
    const ridgeInfo = useSelector((state: StoreType) => state.map.ridgeInfo)

	return (
		<>
			<RouteAllInfoPanel route={ridgeInfo} />
		</>
	)
}

export default RoutePanel
