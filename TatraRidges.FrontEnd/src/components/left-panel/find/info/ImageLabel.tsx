import classes from "./ImageLabel.module.css"

const ImageLabel: React.FC<{ iconSrc:string, alt:string }> = props => {
	return (
        <img
        className={classes.image}
        src={props.iconSrc}
        alt={props.alt}
    />
	)
}

export default ImageLabel
