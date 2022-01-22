import { useSelector, useDispatch } from "react-redux"

import StoreType from "../../store/store-types"
import { uiActions } from "../../store/ui-slice"
import Notification from "../ui/Notification"
import AdminPanel from "./admin-panel"
import UserPanel from "./user-panel"
import FindPanel from "./find-panel"

const MainPanel: React.FC = () => {
	const dispatch = useDispatch()

	const notification = useSelector((state: StoreType) => state.ui.notification)
	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)
	const changePanelVersion = (version: string) =>
		dispatch(uiActions.setPanelVersion(version))

	const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		const button: HTMLButtonElement = event.currentTarget
		const tab = button.id.substring(7)
		changePanelVersion(tab)
	}
	return (
		<div className='left-panel'>
			<h1>Granie Tatr Wysokich</h1>
			<div>
				<button id={"button-find"} onClick={buttonClickHandler}>
					Wyszukiwanie drogi
				</button>
				<button id={"button-admin"} onClick={buttonClickHandler}>
					Narzędzia dministracyjne
				</button>
				<button id={"button-user"} onClick={buttonClickHandler}>
					Panel użytkownika
				</button>
			</div>
			{visiblePanel === "admin" && <AdminPanel />}
			{visiblePanel === "user" && <UserPanel />}
			{visiblePanel === "find" && <FindPanel />}
			<Notification
				status={notification.status}
				title={notification.title}
				message={notification.message}
			/>
		</div>
	)
}

export default MainPanel
