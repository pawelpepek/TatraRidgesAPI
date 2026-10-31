import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { MountainPoint } from "../components/types"
import { deletePointById } from "../store/map-actions"
import StoreType from "../store/store-types"
import useAdminVisible from "./use-admin-visible"
import useAppDispatch from "./use-app-dispatch"

// one object, so the selector returns the same value until a point is chosen
const noPoint = {} as MountainPoint

const usePointDelete = () => {
	const dispatch = useAppDispatch()
	const adminVisible = useAdminVisible()
	const [deleting, setDeleting] = useState(false)

	const okDelete = adminVisible && deleting

	const pointTo = useSelector((state: StoreType) =>
		okDelete ? state.map.pointTo : noPoint
	)

	useEffect(() => {
		if (okDelete) {
			dispatch(deletePointById(pointTo.id))
		}
        setDeleting(false)
	}, [deleting])

	return () => setDeleting(true)
}

export default usePointDelete
