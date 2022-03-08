import { useSelector } from "react-redux"
import StoreType from "../store/store-types"

const usePending = () => {
	return useSelector(
		(state: StoreType) => state.ui.notification.status === "pending"
	)
}

export default usePending
