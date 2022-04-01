import { useSelector } from "react-redux"
import React, { Suspense } from "react"
import StoreType from "../../store/store-types"
import AdminPanel from "./admin/AdminPanel"
import classes from "./MainFunctions.module.css"
import RoutePanel from "./route/RoutePanel"
import HelpPanel from "./help/HelpPanel"

const MainFunctions: React.FC = () => {
	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)

	const SearchPanel = React.lazy(() => import("./find/SearchPanel"))
	const AuthForm = React.lazy(() => import("./authorization/AuthForm"))
	const NavigationPanel = React.lazy(() => import("./NavigationPanel"))

	return (
		<div className={classes.functions}>
			<Suspense fallback={<p>Loading...</p>}>
				{!visiblePanel.startsWith("route") && (
					<>
						<header className={classes.header}>
							<h1>Granie Tatr Wysokich</h1>
						</header>
						<NavigationPanel className={classes.navigation} />
						{visiblePanel === "admin" && <AdminPanel />}
						{visiblePanel === "search" && <SearchPanel />}
						{visiblePanel === "login" && <AuthForm />}
						{visiblePanel === "help" && <HelpPanel/>}
					</>
				)}
				{visiblePanel.startsWith("route") && <RoutePanel />}
			</Suspense>
		</div>
	)
}

export default MainFunctions
