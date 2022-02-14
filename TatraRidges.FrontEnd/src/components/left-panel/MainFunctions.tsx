import { useSelector } from "react-redux"

import StoreType from "../../store/store-types"
import AdminPanel from "./admin/AdminPanel"
import FindPanel from "./find/FindPanel"
import classes from "./MainFunctions.module.css"
import NavigationPanel from "./NavigationPanel"
import AuthForm from "./authorization/AuthForm"
import UserPanel from "./UserPanel"

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
				{visiblePanel === "find" && <FindPanel />}
				{visiblePanel === "login" && <AuthForm />}
			</div>
		</div>
	)
}

export default MainFunctions
