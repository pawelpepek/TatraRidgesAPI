import { useSelector } from "react-redux"
import StoreType from "../store/store-types"

const usePending = () => {
	return [
		useSelector((state: StoreType) =>
			state.ui.notification.status.startsWith("pending")
		),
		useSelector(
			(state: StoreType) => state.ui.notification.status === "pendingInfo"
		),
	]
}

export default usePending
