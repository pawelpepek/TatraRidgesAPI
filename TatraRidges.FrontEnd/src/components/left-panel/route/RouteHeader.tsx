import { useDispatch } from "react-redux"
import RoundButton from "../../ui/RoundButton"
import { uiActions } from "../../../store/ui-slice"
import backIcon from "../../img/back.svg"

import classes from "./RouteHeader.module.css"

interface RouteHeaderProps {
	className?: string
	backVersion: string
	backText: string
	header: string
}

const RouteHeader: React.FC<RouteHeaderProps> = props => {
	const dispatch = useDispatch()

	const buttonClickHandler = () => {
		if (props.backVersion === "search") {
			dispatch(uiActions.setPanelVersion(props.backVersion))
		} else {
			dispatch(uiActions.setRoutePartVisible(-1))
		}
	}

	const className = `${props.className} ${classes.navigation}`
	return (
		<nav className={className}>
			<RoundButton
				className={classes.back}
				idButton={"button-back"}
				alt={props.backText}
				imageSrc={backIcon}
				onClick={buttonClickHandler}
			/>
			<h2 className={classes.header}>{props.header}</h2>
		</nav>
	)
}

export default RouteHeader
