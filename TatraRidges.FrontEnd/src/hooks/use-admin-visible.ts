import { useSelector } from "react-redux"
import StoreType from "../store/store-types"

const useAdminVisible = () => {
	return useSelector((state: StoreType) => state.ui.visiblePanel === "admin")
}

export default useAdminVisible
