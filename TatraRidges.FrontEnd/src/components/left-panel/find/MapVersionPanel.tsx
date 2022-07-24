import RoundButton from "../../ui/RoundButton"
import iconTopo from "../../img/mountain.svg"
import iconJawg from "../../img/tree.svg"
import { useDispatch, useSelector } from "react-redux"
import StoreType from "../../../store/store-types"

import classes from "./MapVersionPanel.module.css"
import { centerActions } from "../../../store/center-slice"

const MapVersionPanel: React.FC = () => {
	const dispatch = useDispatch()
	const mapVersion = useSelector((state: StoreType) => state.center.mapVersion)

	const clickOpenTopoHandler = () => {
		dispatch(centerActions.setVersion(0))
	}
	const clickJawgHandler = () => {
		dispatch(centerActions.setVersion(1))
	}

	return (
		<>
			<RoundButton
				className={`${classes["button-clear"]} ${classes.button}`}
				alt='Mapa w wersji OpenTopoMap'
				imageSrc={iconTopo}
				onClick={clickOpenTopoHandler}
				selected={mapVersion === 0}
			/>
			<RoundButton
				className={classes.button}
				alt='Mapa w wersji Jawg-Terrain'
				imageSrc={iconJawg}
				onClick={clickJawgHandler}
				selected={mapVersion === 1}
			/>
		</>
	)
}

export default MapVersionPanel
