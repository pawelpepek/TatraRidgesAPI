import { Route } from "../../../../store/routeTypes"
import FirstInfoLabel from "../../info/FirstInfoLabel"
import SecondInfoLabel from "../../info/SecondInfoLabel"

const RoutePartPanel: React.FC<{ route: Route }> = props => {
	const route = props.route

	const description =
		"Droga " +
		route.descriptionAdjective.map(a => a.text.toLowerCase()).join(", ")

	const guideDesc = route.guideDescription

	const addDescription = `${guideDesc.guide} część ${guideDesc.volume} nr ${guideDesc.number}`

	return (
		<>
			<FirstInfoLabel
				text1={description}
				text2={addDescription}
				maxDifficulty={route.difficulty}
				rank={route.rank}
				routeType={props.route.routeType}
			/>
			<SecondInfoLabel
				warningText={route.warning}
				infoText={route.info}
				rappeling={route.rappeling}
				isEmptyRoute={false}
				directionDescription={
					route.consistentDirection ? "" : "Droga z opisem w odwrotnym kierunku"
				}
				routeTime={route.routeTime}
			/>
		</>
	)
}

export default RoutePartPanel
