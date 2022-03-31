import ReactTooltip from "react-tooltip"

const Tooltip: React.FC = () => {
	return (
		<ReactTooltip
			type={"info"}
			backgroundColor='aliceblue'
			borderColor='gray'
			border={true}
			textColor='black'
			delayShow={300}
		/>
	)
}

export default Tooltip
