import { useEffect } from "react"
import { useDispatch} from "react-redux"

interface UseFetherProps{
    fetchingMethod: () => (dispatch: any) => Promise<boolean>
    dependiences:any[]
}

const useFetcher = (props:UseFetherProps) => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(props.fetchingMethod())
	}, [dispatch,...props.dependiences])
}

export default useFetcher
