import PointsContainer from "./basics/PointsContainer"
import usePointsGet from "../../hooks/use-points-get"

const RidgesPointsContainer: React.FC = () => {
	const points = usePointsGet()

	return <PointsContainer points={points} />
}

export default RidgesPointsContainer
