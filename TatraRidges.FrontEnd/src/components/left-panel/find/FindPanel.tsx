import PanelHeader from "../PanelHeader"
import PointsPanel from "../points/PointsPanel"

const FindPanel: React.FC = () => {
	return (
		<>
			<PanelHeader text='Wyszukiwanie dróg' />
			<PointsPanel deleteVisible={false} />
		</>
	)
}

export default FindPanel
