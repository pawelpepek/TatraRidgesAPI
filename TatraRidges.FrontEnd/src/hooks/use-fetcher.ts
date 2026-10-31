import { useEffect } from "react"
import useAppDispatch from "./use-app-dispatch"


interface UseFetherProps{
    fetchingMethod: () => (dispatch: any) => Promise<boolean>
    dependiences:any[]
}

const useFetcher = (props:UseFetherProps) => {
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(props.fetchingMethod())
	}, [dispatch,...props.dependiences])
}

export default useFetcher
