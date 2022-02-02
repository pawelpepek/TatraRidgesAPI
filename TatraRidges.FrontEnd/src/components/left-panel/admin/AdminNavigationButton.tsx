import { useDispatch, useSelector } from "react-redux"

import StoreType from "../../../store/store-types"
import { uiActions } from "../../../store/ui-slice"
import RoundButton from "../../ui/round-button"

interface AdminNavButtonProps {
	imageSrc: string
	alt: string
	name: string
}

const AdminNavigationButton: React.FC<AdminNavButtonProps> = props => {
	const dispatch = useDispatch()

	const partVisible = useSelector(
		(state: StoreType) => state.ui.visibleAdminPart
	)

	const clickHandler = () => {
		dispatch(uiActions.setAdminPartVisible(props.name))
	}
	return (
		<RoundButton
			imageSrc={props.imageSrc}
			alt={props.alt}
			onClick={clickHandler}
			selected={partVisible === props.name}
		/>
	)
}

export default AdminNavigationButton
