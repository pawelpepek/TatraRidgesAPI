import PanelHeader from "../PanelHeader"
import PointsPanel from "../points/points-panel"

const FindPanel: React.FC = () => {
	return (
		<>
			<PanelHeader text='Wyszukiwanie dróg' />
			<PointsPanel deleteVisible={false} />
		</>
	)
}

export default FindPanel
