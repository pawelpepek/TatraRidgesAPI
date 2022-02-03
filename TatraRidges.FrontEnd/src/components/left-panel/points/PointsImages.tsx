import startIcon from "../../img/point.svg"
import endIcon from "../../img/mark.svg"
import arrowIcon from "../../img/arrow-down.svg"
import classes from "./PointsImages.module.css"

const PointsImages: React.FC = () => {
	return (
		<div className={classes["images-div"]}>
			<img className={classes.image} src={startIcon} alt='Start point' />
			<img className={classes.image} src={arrowIcon} alt='Arrow' />
			<img className={classes.image} src={endIcon} alt='Mark end point' />
		</div>
	)
}

export default PointsImages
