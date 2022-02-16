import { useSelector } from "react-redux"

import StoreType from "../../store/store-types"
import AdminPanel from "./admin/AdminPanel"
import FindPanel from "./find/FindPanel"
import classes from "./MainFunctions.module.css"
import NavigationPanel from "./NavigationPanel"
import AuthForm from "./authorization/AuthForm"

const MainFunctions: React.FC = () => {
	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)

	return (
		<div className={classes.functions}>
			<header className={classes.header}>
				<h1>Granie Tatr Wysokich</h1>
			</header>
			<NavigationPanel className={classes.navigation} />
				{visiblePanel === "admin" && <AdminPanel />}
				{visiblePanel === "find" && <FindPanel />}
				{visiblePanel === "login" && <AuthForm />}
		</div>
	)
}

export default MainFunctions
