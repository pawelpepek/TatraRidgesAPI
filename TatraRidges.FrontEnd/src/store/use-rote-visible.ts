import { useSelector } from "react-redux"
import StoreType from "./store-types"

const useRouteVisible = () => {
	return useSelector((state: StoreType) =>
		state.ui.visiblePanel.startsWith("route")
	)
}

export default useRouteVisible
