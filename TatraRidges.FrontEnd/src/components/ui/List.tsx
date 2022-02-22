
import classes from "./List.module.css"

const List: React.FC = props => {
	return (
		<ul className={classes.list}>
			{props.children}
		</ul>
	)
}

export default List