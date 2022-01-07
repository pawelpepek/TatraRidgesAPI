import { Marker } from "react-leaflet"
import { Point, icon} from "leaflet"
import { MountainPoint } from "./types"
import passIcon from '../../img/passIcon.svg'
import topIcon from '../../img/topIcon.svg'

const MarkerPoint: React.FC<MountainPoint> = point => {
    const markerIcon=icon({
        iconUrl: point.pointTypeId===1? topIcon:passIcon,
        iconSize: new Point(16, 16,false),
    })

	return (
		<Marker
			key={point.id}
			position={[point.latitude, point.longitude]}
			title={point.name}
            icon={markerIcon}
		/>
	)
}

export default MarkerPoint
