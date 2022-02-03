import { useDispatch, useSelector } from "react-redux"

import { postConnectionRidge } from "../../../store/map-actions"
import StoreType from "../../../store/store-types"
import linkIcon from "../../img/connection.svg"
import RoundButton from "../../ui/RoundButton"
import classes from "./ConnectButton.module.css"

const ConnectButton: React.FC = () => {
	const dispatch = useDispatch()

	const pointFrom = useSelector((state: StoreType) => state.map.pointFrom)
	const pointTo = useSelector((state: StoreType) => state.map.pointTo)

	const clickConnectHandler = () => {
		dispatch(postConnectionRidge(pointFrom.id, pointTo.id))
	}
	return (
		<RoundButton
			className={classes.connection}
			imageSrc={linkIcon}
			alt='Połącz punkty'
			onClick={clickConnectHandler}
		/>
	)
}

export default ConnectButton
