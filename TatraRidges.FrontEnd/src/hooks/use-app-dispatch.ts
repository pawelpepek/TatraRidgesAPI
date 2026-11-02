import { useDispatch } from "react-redux"
import type { AppDispatch } from "../store"

// useDispatch that accepts the thunks returned by dataDispatcher
const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export default useAppDispatch
