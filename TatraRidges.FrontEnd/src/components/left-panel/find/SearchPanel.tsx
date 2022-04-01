import SearchManagePanel from "./SearchManagePanel"
import PointsPanel from "../points/PointsPanel"
import PanelHeader from "../PanelHeader"
import Tooltip from "../../ui/Tooltip"
import classes from "./SearchPanel.module.css"

const SearchPanel: React.FC = () => {
	return (
		<>
			<PanelHeader text='Wyszukiwanie dróg' />
			<PointsPanel deleteVisible={false} />
			<SearchManagePanel />
			<a className={classes.author} href='mailto: pawel.pepek@gmail.com'>
					pawel.pepek@gmail.com
				</a>
			<Tooltip/>
		</>
	)
}

export default SearchPanel
