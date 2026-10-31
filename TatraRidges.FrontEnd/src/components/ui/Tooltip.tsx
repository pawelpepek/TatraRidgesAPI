import { CSSProperties } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"

const style: CSSProperties = {
	backgroundColor: "aliceblue",
	color: "black",
	textAlign: "left",
	zIndex: 2000,
}

// One tooltip for the whole app: elements opt in with
// data-tooltip-id="tooltip" and data-tooltip-content.
const Tooltip: React.FC = () => {
	return (
		<ReactTooltip
			id='tooltip'
			place='left'
			delayShow={300}
			opacity={1}
			border='1px solid gray'
			style={style}
		/>
	)
}

export default Tooltip
