
import classes from "./List.module.css"

const List: React.FC<{className?:string}> = props => {
	const className=`${classes.list} ${props.className}`
	
	return (
		<ul className={className}>
			{props.children}
		</ul>
	)
}

export default List