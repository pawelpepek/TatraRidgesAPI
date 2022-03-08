import LineConnection from "./LineConnection"
import { ConnectionsProps } from "../../types"

const LinesContainer: React.FC<ConnectionsProps> = props => {
	return (
		<>
			{props.connections.map(c => (
				<LineConnection
					key={`line_${c.id}`}
					id={c.id}
					point1={c.point1}
					point2={c.point2}
					color={c.color}
				/>
			))}
		</>
	)
}

export default LinesContainer
