import SearchManagePanel from "./SearchManagePanel"
import PointsPanel from "../points/PointsPanel"
import PanelHeader from "../PanelHeader"

const SearchPanel: React.FC = () => {
	return (
		<>
			<PanelHeader text='Wyszukiwanie dróg' />
			<PointsPanel deleteVisible={false} />
			<SearchManagePanel />
		</>
	)
}

export default SearchPanel
