import { useSelector } from "react-redux"

import StoreType from "../../../store/store-types"
import PointLabel from "./PointLabel"
import classes from "./PointsLabels.module.css"

const PointsLabels: React.FC<{ deleteVisible: boolean }> = props => {
	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	return (
		<div className={classes["points-div"]}>
			<PointLabel point={pointFrom} />
			<PointLabel point={pointTo} deleteVisible={props.deleteVisible} />
		</div>
	)
}

export default PointsLabels
