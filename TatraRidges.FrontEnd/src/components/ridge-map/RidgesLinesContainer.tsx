import LinesContainer from "./basics/LinesContainer"
import useConnectionsGet from "../../hooks/use-connections-get"

const RidgesLinesContainer: React.FC = () => {
	const connections = useConnectionsGet()

	return <LinesContainer connections={connections} />
}

export default RidgesLinesContainer
