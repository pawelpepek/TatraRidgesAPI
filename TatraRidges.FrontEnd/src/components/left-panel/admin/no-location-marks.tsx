import { useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import PointOption from "./point-option"
import classes from "./no-location-marks.module.css"
import Description from "./description"

const NoLocationMarks: React.FC<{ className?: string }> = props => {
	const points = useSelector((state: StoreType) => state.map.points)

	const noLocationPoints = points
		.filter(p => p.latitude === 0 || p.longitude === 0)
		.sort((a, b) => (a.name > b.name ? 1 : -1))

	return (
		<div className={props.className}>
			<Description text='Punkty bez lokalizacji' />
			<select size={20} className={classes["no-location-list"]}>
				{noLocationPoints.map(p => (
					<PointOption key={p.id} point={p} />
				))}
			</select>
		</div>
	)
}

export default NoLocationMarks
