import SearchManagePanel from "./SearchManagePanel"
import PointsPanel from "../points/PointsPanel"
import PanelHeader from "../PanelHeader"
import Tooltip from "../../ui/Tooltip"

const SearchPanel: React.FC = () => {
	return (
		<>
			<PanelHeader text='Wyszukiwanie dróg' />
			<PointsPanel deleteVisible={false} />
			<SearchManagePanel />
			<Tooltip/>
		</>
	)
}

export default SearchPanel
