import { RidgeWithRoutes } from "../../../store/routeTypes"
import ReactApexChart from "react-apexcharts"
import { ApexOptions } from "apexcharts"
import { LatLng } from "leaflet"
import { MountainPoint } from "../../types"
import { getNotNullable } from "../../helpers/functions"
import classes from "./Chart.module.css"

const Chart: React.FC<{ parts: RidgeWithRoutes[] }> = props => {
	const isNotEmpty = props.parts.length > 0

	const getDistance = (point1: MountainPoint, point2: MountainPoint) => {
		const from = new LatLng(point1.latitude, point1.longitude)
		const to = new LatLng(point2.latitude, point2.longitude)

		return from.distanceTo(to)
	}

	let distance = 0

	const getData = (point1?: MountainPoint, point2?: MountainPoint) => {
		const p1 = getNotNullable(point1)
		const p2 = getNotNullable(point2)

		distance += getDistance(p1, p2)

		return {
			x: distance,
			y: p2.evaluation,
		}
	}

	const data = props.parts.map(c => getData(c.point1, c.point2))

	const first = {
		x: 0,
		y: getNotNullable(props.parts[0].point1).evaluation,
	}

	data.unshift(first)

	const chartData: ApexOptions = {
		series: [
			{
				name: "Punkt",
				data,
			},
		],
		
		chart: {
			height: 150,
			toolbar: {
				show: true,
				tools: {
					download: false,
				},
			},
			type: "area",
			stacked: false,
			zoom: {
				// 	type: "x",
				enabled: false,
				// 	autoScaleYaxis: true,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: "smooth",
		},
		yaxis: {
			opposite: true,
		},
		xaxis: {
			type: 'numeric',
		  },
	}
	return (
		<div className={classes.container}>
			{isNotEmpty && (
				<ReactApexChart
					options={chartData}
					series={chartData.series}
					type='area'
					height={150}
				/>
			)}
		</div>
	)
}

export default Chart
