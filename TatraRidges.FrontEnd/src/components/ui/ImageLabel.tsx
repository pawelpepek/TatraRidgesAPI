import classes from "./ImageLabel.module.css"

const ImageLabel: React.FC<{ iconSrc:string, alt:string }> = props => {
    const text=props.alt.replaceAll("\n","<br />")
    
	return (
        <img
        data-tip={text}
        className={classes.image}
        src={props.iconSrc}
        alt={props.alt}
    />
	)
}

export default ImageLabel
