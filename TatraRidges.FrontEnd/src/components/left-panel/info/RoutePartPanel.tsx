import { Route } from "../../../store/routeTypes"
import FirstInfoLabel from "./FirstInfoLabel"
import SecondInfoLabel from "./SecondInfoLabel"

const RoutePartPanel: React.FC<{ route: Route }> = props => {
	const route = props.route

	const description =
		"Droga " + route.descriptionAdjective.map(a => a.text).join(", ")

	const guideDesc = route.guideDescription

	const addDescription = `${guideDesc.guide} część ${guideDesc.volume} nr ${guideDesc.number}`
	return (
		<>
			<FirstInfoLabel
				text1={description}
				text2={addDescription}
				maxDifficulty={route.difficulty}
				rank={route.rank}
			/>
			<SecondInfoLabel
				rappeling={route.rappeling}
				isEmptyRoute={false}
				isConsistentDirection={route.consistentDirection}
				routeTime={route.routeTime}
			/>
		</>
	)
}

export default RoutePartPanel
