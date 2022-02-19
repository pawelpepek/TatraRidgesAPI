import RoundButton from "../../ui/RoundButton"
import icon from "../../img/search.svg"
import { useDispatch, useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import { getRidge } from "../../../store/map-actions"

import classes from "./SearchManagePanel.module.css"

const SearchManagePanel: React.FC = () => {
	const dispatch = useDispatch()

	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	const clickHandler = () => {
		if (pointFrom.name !== undefined && pointTo.name !== undefined) {
			dispatch(getRidge(pointFrom.id, pointTo.id))
		}
	}

	const enabled =pointFrom.id>=0 && pointTo.id>=0 

	return (
		<div className={classes["manage-panel"]}>
			<RoundButton className={classes.button} alt='Wyszukaj' imageSrc={icon} onClick={clickHandler} disabled={!enabled}/>
		</div>
	)
}

export default SearchManagePanel