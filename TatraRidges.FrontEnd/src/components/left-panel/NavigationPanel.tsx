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
	const logged = useSelector((state: StoreType) => state.ui.isLogged)

	const getTab = (id: string) => id.substring(7)

	const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		const button: HTMLButtonElement = event.currentTarget
		if (button.id === "button-logout") {
			dispatch(uiActions.setLogged(false))
			changePanelVersion("search")
		} else {
			changePanelVersion(getTab(button.id))
		}
	}

	const className = `${props.className} ${classes.navigation}`

	return (
		<nav className={className}>
			<RoundButton
				idButton={"button-search"}
				alt='Wyszukiwanie drogi'
				imageSrc={mapIcon}
				onClick={buttonClickHandler}
				selected={visiblePanel === "search"}
			/>
			<RoundButton
				idButton={"button-admin"}
				alt='Narzędzia administracyjne'
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
					selected={visiblePanel === "login"}
				/>
			)}
			{logged && (
				<RoundButton
					className={classes.login}
					idButton={"button-logout"}
					alt='Wyloguj'
					imageSrc={userIcon}
					onClick={buttonClickHandler}
				/>
			)}
		</nav>
	)
}

export default NavigationPanel
