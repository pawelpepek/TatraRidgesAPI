import classes from "./SecondInfoLabel.module.css"
import rappelingIcon from "../../img/rappeling-small.svg"
import diffDirectionIcon from "../../img/different-direction.svg"
import warnigIcon from "../../img/warning.svg"
import infoIcon from "../../img/info.svg"
import TimeLabel from "./TimeLabel"
import ImageLabel from "../../ui/ImageLabel"

interface SecondInfoLabel {
	isEmptyRoute: boolean
	directionDescription: string
	rappeling: boolean
	warningText: string
	infoText: string
	routeTime: Date
}
const SecondInfoLabel: React.FC<SecondInfoLabel> = props => {
	return (
		<div className={classes.description}>
			{props.isEmptyRoute && (
				<div className={classes["additiona-info"]}>
					<span className={classes.empty}>Brak danych</span>
				</div>
			)}

			{props.warningText && (
				<ImageLabel iconSrc={warnigIcon} alt={props.warningText} />
			)}

			{props.infoText && <ImageLabel iconSrc={infoIcon} alt={props.infoText} />}

			{props.directionDescription !== "" && (
				<ImageLabel
					iconSrc={diffDirectionIcon}
					alt={props.directionDescription}
				/>
			)}

			{props.rappeling && (
				<ImageLabel iconSrc={rappelingIcon} alt='Zjazd na linie' />
			)}

			<TimeLabel routeTime={props.routeTime} />
		</div>
	)
}

export default SecondInfoLabel
