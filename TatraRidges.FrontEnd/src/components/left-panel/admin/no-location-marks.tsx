import { useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import PointOption from "./point-option"
import classes from "./no-location-marks.module.css"

const NoLocationMarks: React.FC<{ className?: string }> = props => {
	const points = useSelector((state: StoreType) => state.map.points)

	const noLocationPoints = points
		.filter(p => p.latitude === 0 || p.longitude === 0)
		.sort((a, b) => (a.name > b.name ? 1 : -1))

	const className = `${props.className} ${classes["no-location-list"]}`
	return (
		<>
			<h4 className={classes.description}>Punkty bez lokalizacji</h4>
			<select size={20} className={className}>
				{noLocationPoints.map(p => (
					<PointOption key={p.id} point={p} />
				))}
			</select>
		</>
	)
}

export default NoLocationMarks
