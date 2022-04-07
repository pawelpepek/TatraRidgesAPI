import ReactTooltip from "react-tooltip"
import  "./Tooltip.css"

const Tooltip: React.FC = () => {
	return (
		<ReactTooltip
			type={"info"}
			backgroundColor='aliceblue'
			borderColor='gray'
			border={true}
			textColor='black'
			delayShow={300}
			multiline={true}
			data-effect="solid" 
			data-place="left" 
		/>
	)
}

export default Tooltip
