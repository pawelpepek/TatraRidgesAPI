import classes from "./DescriptionLabel.module.css"

const DescriptionLabel: React.FC<{ text: string; text2?: string }> = props => {
	return (
		<section className={classes.section}>
			<span>{props.text}</span>
			{props.text2 !== undefined && <p>props.text2</p>}
		</section>
	)
}

export default DescriptionLabel
