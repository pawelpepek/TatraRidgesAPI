import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MountainPoint } from "../components/types"
import { deletePointById } from "../store/map-actions"
import StoreType from "../store/store-types"
import useAdminVisible from "./use-admin-visible"

const usePointDelete = () => {
	const dispatch = useDispatch()
	const adminVisible = useAdminVisible()
	const [deleting, setDeleting] = useState(false)

	const okDelete = adminVisible && deleting

	const pointTo = useSelector((state: StoreType) =>
		okDelete ? state.map.pointTo : ({} as MountainPoint)
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
