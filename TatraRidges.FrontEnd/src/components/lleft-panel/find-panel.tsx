import PointsPanel from "./points-panel"

const FindPanel: React.FC = () => {
	return (
		<>
            <h2>Wyszukiwanie dróg</h2>
			<PointsPanel deleteVisible={false} />
		</>
	)
}

export default FindPanel