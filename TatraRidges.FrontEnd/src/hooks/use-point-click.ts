import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MountainPoint } from "../components/types"
import { pointsActions } from "../store/map-slice"
import StoreType from "../store/store-types"

const usePointClick = (point:MountainPoint) => {
	const dispatch = useDispatch()
	const [clicked, setClicked] = useState(false)

	const isRoute = useSelector((state: StoreType) =>
		clicked ? state.ui.visiblePanel.startsWith("route") : false
	)

	useEffect(() => {
		if (clicked) {
			if (!isRoute) {
				dispatch(pointsActions.setActualPoint({ point }))
			}
			setClicked(false)
		}
	}, [clicked])

	const click=()=>setClicked(true)

	return click
}

export default usePointClick
