import { useCallback, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RidgeWithRoutes } from "../../../store/routeTypes"
import StoreType from "../../../store/store-types"
import { routeProfile } from "../../../store/route-profile"
import classes from "./Chart.module.css"

interface ChartProps {
	parts: RidgeWithRoutes[]
	className: string
}

// One metre takes the same number of pixels across and up, so the profile shows the real
// steepness: a short route fills the panel's width, a long one scrolls.
const LONG_ROUTE_SCALE = 0.5 // px per metre, when the route does not fit the panel at this scale
const MAX_PLOT_HEIGHT = 200 // px; routes with a bigger height difference get a smaller scale
const PAD = { left: 8, right: 8, top: 10, bottom: 20 }
const AXIS_WIDTH = 50

const formatDistance = (metres: number) =>
	metres >= 1000
		? `${(metres / 1000).toFixed(1).replace(".", ",")} km`
		: `${Math.round(metres)} m`

const Chart: React.FC<ChartProps> = props => {
	const geometry = useSelector((state: StoreType) => state.ridgeGeometry.byId)
	const profile = useMemo(
		() => routeProfile(props.parts, geometry),
		[props.parts, geometry]
	)
	const [hover, setHover] = useState<number | null>(null)

	// Width left for the plot next to the height axis, followed as the panel changes size
	const [available, setAvailable] = useState(0)
	const observer = useRef<ResizeObserver | null>(null)
	const measure = useCallback((element: HTMLDivElement | null) => {
		observer.current?.disconnect()
		observer.current = null
		if (element !== null) {
			observer.current = new ResizeObserver(() =>
				setAvailable(element.clientWidth - AXIS_WIDTH)
			)
			observer.current.observe(element)
		}
	}, [])

	if (profile.samples.length < 2) {
		return null
	}

	const heights = profile.samples.map(s => s.height)
	const top = Math.ceil((Math.max(...heights) + 5) / 10) * 10
	const bottom = Math.floor((Math.min(...heights) - 5) / 10) * 10
	const fitWidth = (available - PAD.left - PAD.right) / profile.length
	const scale = Math.min(
		Math.max(fitWidth, LONG_ROUTE_SCALE),
		MAX_PLOT_HEIGHT / (top - bottom)
	)
	const width = PAD.left + profile.length * scale + PAD.right
	const height = PAD.top + (top - bottom) * scale + PAD.bottom
	const x = (distance: number) => PAD.left + distance * scale
	const y = (h: number) => PAD.top + (top - h) * scale

	const gridStep =
		[10, 20, 50, 100, 200, 500].find(step => step * scale >= 28) ?? 1000
	const grid: number[] = []
	for (
		let h = Math.ceil(bottom / gridStep) * gridStep;
		h <= top;
		h += gridStep
	) {
		grid.push(h)
	}
	const distanceStep =
		[50, 100, 200, 500, 1000, 2000, 5000].find(step => step * scale >= 70) ??
		10000
	const distanceMarks: number[] = []
	for (let d = 0; d <= profile.length; d += distanceStep) {
		distanceMarks.push(d)
	}

	const line = profile.samples
		.map(
			(s, i) =>
				`${i ? "L" : "M"}${x(s.distance).toFixed(1)},${y(s.height).toFixed(1)}`
		)
		.join("")
	const area = `${line}L${x(profile.length).toFixed(1)},${y(bottom)}L${x(0)},${y(bottom)}Z`

	const onMove = (event: React.MouseEvent<SVGSVGElement>) => {
		const box = event.currentTarget.getBoundingClientRect()
		const distance = (event.clientX - box.left - PAD.left) / scale
		let best = 0
		profile.samples.forEach((s, i) => {
			if (
				Math.abs(s.distance - distance) <
				Math.abs(profile.samples[best].distance - distance)
			) {
				best = i
			}
		})
		setHover(best)
	}
	const hovered = hover === null ? undefined : profile.samples[hover]

	return (
		<div className={`${classes.container} ${props.className}`}>
			<div className={classes.chart} ref={measure}>
				<div className={classes.scroll}>
					<svg
						width={width}
						height={height}
						onMouseMove={onMove}
						onMouseLeave={() => setHover(null)}
						role="img"
						aria-label="Profil wysokościowy trasy"
					>
						{grid.map(h => (
							<line
								key={h}
								className={classes.grid}
								x1={0}
								x2={width}
								y1={y(h)}
								y2={y(h)}
							/>
						))}
						<path className={classes.area} d={area} />
						<path className={classes.line} d={line} />
						{profile.points.map((p, i) => (
							<g key={i}>
								<line
									className={classes.section}
									x1={x(p.distance)}
									x2={x(p.distance)}
									y1={PAD.top}
									y2={y(bottom)}
								/>
								<circle
									className={classes.point}
									cx={x(p.distance)}
									cy={y(p.height)}
									r={2.5}
								>
									<title>{p.name}</title>
								</circle>
							</g>
						))}
						{distanceMarks.map(d => (
							<text
								key={d}
								className={classes.label}
								x={x(d)}
								y={height - 5}
								textAnchor={d === 0 ? "start" : "middle"}
							>
								{formatDistance(d)}
							</text>
						))}
						{hovered && (
							<g>
								<line
									className={classes.cursor}
									x1={x(hovered.distance)}
									x2={x(hovered.distance)}
									y1={PAD.top}
									y2={y(bottom)}
								/>
								<circle
									className={classes.cursorPoint}
									cx={x(hovered.distance)}
									cy={y(hovered.height)}
									r={3.5}
								/>
								<text
									className={classes.cursorLabel}
									x={
										x(hovered.distance) +
										(x(hovered.distance) > width - 90 ? -6 : 6)
									}
									y={PAD.top + 10}
									textAnchor={
										x(hovered.distance) > width - 90 ? "end" : "start"
									}
								>
									{`${Math.round(hovered.height)} m · ${formatDistance(hovered.distance)}`}
								</text>
							</g>
						)}
					</svg>
				</div>
				<svg
					width={AXIS_WIDTH}
					height={height}
					className={classes.axis}
					aria-hidden="true"
				>
					{grid.map(h => (
						<text key={h} className={classes.label} x={4} y={y(h) + 4}>
							{`${h} m`}
						</text>
					))}
				</svg>
			</div>
			{profile.measured < props.parts.length && (
				<p className={classes.note}>
					{profile.measured === 0
						? "Profil uproszczony: linia prosta między wysokościami punktów."
						: `Odcinki bez danych z lotniczego skaningu (${props.parts.length - profile.measured} z ${props.parts.length}) są prostymi między wysokościami punktów.`}
				</p>
			)}
		</div>
	)
}

export default Chart
