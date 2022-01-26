import classes from "./Notification.module.css"

interface notificationInfo {
	status: string
	title: string
	message: string
}

const Notification: React.FC<notificationInfo> = props => {
	let specialClasses = ""

	if (props.status === "error") {
		specialClasses = classes.error
	}
	if (props.status === "success") {
		specialClasses = classes.success
	}
	if (props.status === "pending") {
		specialClasses = classes.pending
	}
	const cssClasses = `${classes.notification} ${specialClasses}`

	return (
		<div  className={cssClasses}>
			<section className={classes.section}>
				<h4>{props.message}</h4>
			</section>
		</div>
	)
}

export default Notification
