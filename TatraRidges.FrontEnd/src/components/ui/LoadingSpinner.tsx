import classes from "./LoadingSpinner.module.css"

const LoadingSpinner: React.FC = props => {
	return (
		<div className={classes.spinner}>
			{props.children ? props.children : null}
		</div>
	)
}

export default LoadingSpinner
