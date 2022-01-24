import { useSelector } from "react-redux"
import StoreType from "../../store/store-types"
import PointOption from "./point-option"

const NoLocationMarks: React.FC = () => {
	const points = useSelector((state: StoreType) => state.map.points)

	const noLocationPoints = points
		.filter(p => p.latitude === 0 || p.longitude === 0)
		.sort((a, b) => (a.name > b.name ? 1 : -1))

	return (
		<select size={20}>
			{noLocationPoints.map(p => (
				<PointOption  key={p.id} point={p}/>
			))}
		</select>
	)
}

export default NoLocationMarks
