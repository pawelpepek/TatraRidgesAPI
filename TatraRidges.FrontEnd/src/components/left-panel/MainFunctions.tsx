import { useSelector } from "react-redux"
import React, { Suspense } from "react"
import StoreType from "../../store/store-types"
import classes from "./MainFunctions.module.css"
import RoutePanel from "./route/RoutePanel"
import HelpPanel from "./help/HelpPanel"

// Outside the component: a lazy component created during render suspends again on every render.
// The admin panel brings react-select, which visitors never need.
const AdminPanel = React.lazy(() => import("./admin/AdminPanel"))
const SearchPanel = React.lazy(() => import("./find/SearchPanel"))
const AuthForm = React.lazy(() => import("./authorization/AuthForm"))
const NavigationPanel = React.lazy(() => import("./NavigationPanel"))

const MainFunctions: React.FC = () => {
	const visiblePanel = useSelector((state: StoreType) => state.ui.visiblePanel)

	return (
		<div className={classes.functions}>
			<Suspense fallback={<p>Wczytywanie…</p>}>
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
