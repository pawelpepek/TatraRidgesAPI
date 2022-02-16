import { RouteSummary } from "../../../store/routeTypes"
import classes from "./RouteSummaryPanel.module.css"
import rappelingIcon from "../../img/rappeling-small.svg"
import diffDirectionIcon from "../../img/different-direction.svg"

const RouteSummaryPanel: React.FC<{ summary: RouteSummary }> = props => {
	const rank =
		props.summary.rank > 0 ? "+" + props.summary.rank : props.summary.rank + ""

	const parts = props.summary.routeTime.toString().split(":")

	const hours = parseInt(parts[0])
	const minutes = parseInt(parts[1])

	const hoursText = hours > 0 ? `${hours} godz. ` : ""
	const minutesText = minutes > 0 ? `${minutes} min.` : ""

	return (
			<div className={classes.container}>
				<div className={classes.description}>
					<section className={classes.section}>
						{props.summary.description}
					</section>
					<div className={classes.numbers}>
						<section className={classes.rank}>
							<p>{rank}</p>
						</section>
						<section>
							<span
								className={
									classes.difficulty
								}>{`${props.summary.avarageDifficulty.text}/`}</span>
							<span className={classes["difficulty-max"]}>
								{props.summary.maxDifficulty.text}
							</span>
						</section>
					</div>
				</div>
				<div className={classes.description}>
					<div className={classes["additiona-info"]}>
						{props.summary.isEmptyRoute && (
							<span className={classes.empty}>Brak danych</span>
						)}
					</div>
					{!props.summary.isConsistentDirection && (
						<img
							className={classes.image}
							src={diffDirectionIcon}
							alt='Występują drogi z opisem w odwrotnym kierunku'
						/>
					)}
					{props.summary.rappeling && (
						<img
							className={classes.image}
							src={rappelingIcon}
							alt='Zjazd na linie'
						/>
					)}
					<div className={classes.time}>
						<span>{`${hoursText}${minutesText}`}</span>
					</div>
				</div>
			</div>
	)
}

export default RouteSummaryPanel
