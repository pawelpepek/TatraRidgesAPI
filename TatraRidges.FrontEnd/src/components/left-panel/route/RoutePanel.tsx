import { useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import Tooltip from "../../ui/Tooltip"
import RouteAllInfoPanel from "./RouteAllInfoPanel"
import RouteHeader from "./RouteHeader"

const RoutePanel: React.FC = () => {
    const ridgeInfo = useSelector((state: StoreType) => state.map.ridgeInfo)

	return (
		<>
            <RouteHeader/>
			<RouteAllInfoPanel route={ridgeInfo} />
			<Tooltip/>
		</>
	)
}

export default RoutePanel
