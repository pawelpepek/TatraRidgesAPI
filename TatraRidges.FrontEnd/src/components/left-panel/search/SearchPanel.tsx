import RoundButton from "../../ui/RoundButton"
import PanelHeader from "../PanelHeader"
import PointsPanel from "../points/PointsPanel"
import icon from "../../img/route.svg"
import { useDispatch, useSelector } from "react-redux"
import StoreType from "../../../store/store-types"
import { getRidge } from "../../../store/map-actions"

const SearchPanel: React.FC = () => {
	const dispatch = useDispatch()

	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (pointFrom.name !== undefined && pointTo.name !== undefined) {
			dispatch(getRidge(pointFrom.id, pointTo.id))
		}
	}
	return (
		<>
			<PanelHeader text='Wyszukiwanie dróg' />
			<PointsPanel deleteVisible={false} />
			<RoundButton alt='Wyszukaj' imageSrc={icon} onClick={clickHandler} />
		</>
	)
}

export default SearchPanel
