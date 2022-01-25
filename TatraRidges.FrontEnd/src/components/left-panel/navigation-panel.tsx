import { useSelector, useDispatch } from "react-redux"

import StoreType from "../../store/store-types"
import { uiActions } from "../../store/ui-slice"
import mapIcon from "../img/map.svg"
import userIcon from "../img/user.svg"
import userOffIcon from "../img/user-off.svg"
import adminIcon from "../img/tools.svg"
import RoundButton from "../../components/ui/round-button"
import classes from "./navigation-panel.module.css"

const NavigationPanel: React.FC = () => {
	const dispatch = useDispatch()

	const changePanelVersion = (version: string) =>
		dispatch(uiActions.setPanelVersion(version))

	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)
    const logged = useSelector((state: StoreType) => state.ui.logged)

	const getTab = (id: string) => id.substring(7)

	const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		const button: HTMLButtonElement = event.currentTarget
        
		if(button.id.substring(7,10)==="log")
        {
            dispatch(uiActions.setLogged(button.id==="button-login"))
        }
        else{
            changePanelVersion(getTab(button.id))
        }
        
	}
	return (
		<nav className={classes.navigation}>
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
			{!logged && <RoundButton
				className={classes.login}
				idButton={"button-login"}
				alt='Panel użytkownika'
				imageSrc={userOffIcon}
				onClick={buttonClickHandler}
			/>}
            {logged && <RoundButton
				className={classes.login}
				idButton={"button-logout"}
				alt='Panel użytkownika'
				imageSrc={userIcon}
				onClick={buttonClickHandler}
			/>}
		</nav>
	)
}

export default NavigationPanel
