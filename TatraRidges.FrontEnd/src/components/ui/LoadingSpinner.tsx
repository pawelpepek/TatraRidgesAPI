import classes from "./LoadingSpinner.module.css"

const LoadingSpinner: React.FC<React.PropsWithChildren> = props => {
	return (
		<div className={classes.spinner}>
			{props.children ? props.children : null}
		</div>
	)
}

export default LoadingSpinner
