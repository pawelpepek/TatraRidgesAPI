import { useSelector, useDispatch } from "react-redux"

import StoreType from "../../store/store-types"
import { uiActions } from "../../store/ui-slice"

const NavigationPanel: React.FC = () => {
    const dispatch = useDispatch()
    
	const changePanelVersion = (version: string) =>
		dispatch(uiActions.setPanelVersion(version))

	const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		const button: HTMLButtonElement = event.currentTarget
		const tab = button.id.substring(7)
		changePanelVersion(tab)
	}
	return (
		<nav>
				<button id={"button-find"} onClick={buttonClickHandler}>
					Wyszukiwanie drogi
				</button>
				<button id={"button-admin"} onClick={buttonClickHandler}>
					Narzędzia dministracyjne
				</button>
				<button id={"button-user"} onClick={buttonClickHandler}>
					Panel użytkownika
				</button>
		</nav>
	)
}

export default NavigationPanel
