import { useSelector } from "react-redux"

import StoreType from "../../store/store-types"
import AdminPanel from "./admin/AdminPanel"
import SearchPanel from "./find/SearchPanel"
import classes from "./MainFunctions.module.css"
import NavigationPanel from "./NavigationPanel"
import AuthForm from "./authorization/AuthForm"
import RoutePanel from "./route/RoutePanel"

const MainFunctions: React.FC = () => {
	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)

	return (
		<div className={classes.functions}>
			{visiblePanel !== "route" && (
				<>
					<header className={classes.header}>
						<h1>Granie Tatr Wysokich</h1>
					</header>
					<NavigationPanel className={classes.navigation} />
					{visiblePanel === "admin" && <AdminPanel />}
					{visiblePanel === "search" && <SearchPanel />}
					{visiblePanel === "login" && <AuthForm />}
				</>
			)}
			{visiblePanel === "route" && <RoutePanel />}
		</div>
	)
}

export default MainFunctions
