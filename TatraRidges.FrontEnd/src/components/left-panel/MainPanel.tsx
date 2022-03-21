import { useSelector } from "react-redux"
import StoreType from "../../store/store-types"
import classes from "./MainPanel.module.css"
import MainFunctions from "./MainFunctions"
import useRouteVisible from "../../hooks/use-rote-visible"
import React from 'react'

const MainPanel: React.FC = () => {
	const errorMessage = useSelector((state: StoreType) =>
		state.ui.notification.status == "error" ? state.ui.notification.message : ""
	)
	const isRoute = useRouteVisible()

	const Notification=React.lazy(()=>import("../ui/Notification"))

	let className = `${classes.main} ${isRoute ? classes.maxHeight : ""}`

	return (
		<div className={className}>
			<MainFunctions />
			{!isRoute && errorMessage !== "" && (
				<Notification status='error' message={errorMessage} />
			)}
		</div>
	)
}

export default MainPanel
