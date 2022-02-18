import onRidgeIcon from "../../img/on-ridge.svg"
import farRidgeIcon from "../../img/far-ridge.svg"
import nearRidgeIcon from "../../img/near-ridge.svg"
import { RouteType } from "../../../store/routeTypes"
import ImageLabel from "./ImageLabel"

const RouteTypeLabel: React.FC<{ routeType: RouteType }> = props => {
	const getIcon = (value: number) => {
		switch (value) {
			case 1:
				return onRidgeIcon
			case 2:
				return nearRidgeIcon
			default:
				return farRidgeIcon
		}
	}

	const icon = getIcon(props.routeType.id)

	return <ImageLabel iconSrc={icon} alt={props.routeType.name} />
}

export default RouteTypeLabel
