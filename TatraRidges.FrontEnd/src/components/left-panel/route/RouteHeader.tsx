import { useDispatch } from "react-redux"
import RoundButton from "../../ui/RoundButton"
import { uiActions } from "../../../store/ui-slice"
import backIcon from "../../img/back.svg"

import classes from "./RouteHeader.module.css"

const RouteHeader: React.FC<{ className?: string }> = props => {
	const dispatch = useDispatch()

	const buttonClickHandler = () => {
		dispatch(uiActions.setPanelVersion("search"))
	}

	const className = `${props.className} ${classes.navigation}`
	return (
		<nav className={className}>
			<RoundButton
				className={classes.back}
				idButton={"button-back"}
				alt='Wróć do wyszukiwania'
				imageSrc={backIcon}
				onClick={buttonClickHandler}
			/>
            <h2 className={classes.header}>Wynik wyszukiwania</h2>
		</nav>
	)
}

export default RouteHeader
