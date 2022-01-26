import { useSelector } from "react-redux"

import StoreType from "../../store/store-types"
import AdminPanel from "./admin/admin-panel"
import FindPanel from "./find/find-panel"
import classes from "./main-functions.module.css"
import NavigationPanel from "./navigation-panel"
import UserPanel from "./user-panel"

const MainFunctions: React.FC = () => {
	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)

	return (
		<div className={classes.functions}>
			<header>
				<h1>Granie Tatr Wysokich</h1>
			</header>
			<NavigationPanel className={classes.navigation} />
			<div className={classes.panel}>
				{visiblePanel === "admin" && <AdminPanel />}
				{visiblePanel === "user" && <UserPanel />}
				{visiblePanel === "find" && <FindPanel />}
			</div>
		</div>
	)
}

export default MainFunctions
