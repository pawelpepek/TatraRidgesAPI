import { useSelector, useDispatch } from "react-redux"

import RoundButton from "../ui/RoundButton"
import StoreType from "../../store/store-types"
import { uiActions } from "../../store/ui-slice"
import mapIcon from "../img/map.svg"
import adminIcon from "../img/tools.svg"
import userIcon from "../img/user.svg"
import userOffIcon from "../img/user-off.svg"
import classes from "./NavigationPanel.module.css"

const NavigationPanel: React.FC<{ className?: string }> = props => {
	const dispatch = useDispatch()

	const changePanelVersion = (version: string) =>
		dispatch(uiActions.setPanelVersion(version))

	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)
	const logged = useSelector((state: StoreType) => state.ui.logged)

	const getTab = (id: string) => id.substring(7)

	const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		const button: HTMLButtonElement = event.currentTarget

		if (button.id.substring(7, 10) === "log") {
			dispatch(uiActions.setLogged(button.id === "button-login"))
		} else {
			changePanelVersion(getTab(button.id))
		}
	}

	const className = `${props.className} ${classes.navigation}`

	return (
		<nav className={className}>
			<RoundButton
				idButton={"button-find"}
				alt='Wyszukiwanie drogi'
				imageSrc={mapIcon}
				onClick={buttonClickHandler}
				selected={visiblePanel === "find"}
			/>
			<RoundButton
				idButton={"button-admin"}
				alt='Narzędzia dministracyjne'
				imageSrc={adminIcon}
				onClick={buttonClickHandler}
				selected={visiblePanel === "admin"}
				disabled={!logged}
			/>
			{!logged && (
				<RoundButton
					className={classes.login}
					idButton={"button-login"}
					alt='Panel użytkownika'
					imageSrc={userOffIcon}
					onClick={buttonClickHandler}
				/>
			)}
			{logged && (
				<RoundButton
					className={classes.login}
					idButton={"button-logout"}
					alt='Panel użytkownika'
					imageSrc={userIcon}
					onClick={buttonClickHandler}
				/>
			)}
		</nav>
	)
}

export default NavigationPanel