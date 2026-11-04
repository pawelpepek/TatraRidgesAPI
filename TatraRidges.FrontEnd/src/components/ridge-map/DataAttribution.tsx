import L from "leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"
import { useSelector } from "react-redux"
import StoreType from "../../store/store-types"

const POLISH_FLAG =
	'<svg aria-label="Polska" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#fff" d="M0 0h12v4H0z"/><path fill="#DC143C" d="M0 4h12v4H0z"/></svg>'

// Bez godła flaga Słowacji wyglądałaby jak rosyjska, więc godło jest uproszczone, ale jest
const SLOVAK_FLAG =
	'<svg aria-label="Słowacja" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 900 600" class="leaflet-attribution-flag"><path fill="#fff" d="M0 0h900v200H0z"/><path fill="#0B4EA2" d="M0 200h900v200H0z"/><path fill="#EE1C25" d="M0 400h900v200H0z"/><path fill="#EE1C25" stroke="#fff" stroke-width="18" d="M150 120h260v210q0 140-130 190-130-50-130-190z"/><path fill="#fff" d="M268 160h24v290h-24zM225 205h110v23H225zM205 265h150v25H205z"/><path fill="#0B4EA2" d="M170 440q45-50 80-20 30-50 60 0 35-30 80 20-50 60-110 80-60-20-110-80z"/></svg>'

const TEXT =
	"Linie i profile grani opracowane na podstawie: " +
	'NMT © <a href="https://www.geoportal.gov.pl" target="_blank" rel="noopener">GUGiK</a>; ' +
	'DMR 5.0 © <a href="https://www.skgeodesy.sk" target="_blank" rel="noopener">ÚGKK SR</a>, ' +
	'licencja <a href="https://creativecommons.org/licenses/by/4.0/deed.pl" target="_blank" rel="noopener">CC BY 4.0</a> ' +
	"(dane przetworzone)"

// Źródła linii i profili grani jako osobny wiersz nad podpisem Leafleta. Kontrolki w dolnych
// narożnikach Leaflet wstawia nad istniejącymi, więc ta trafia nad atrybucję mapy.
// Pokazywany dopiero, gdy linie i profile są wczytane.
const DataAttribution: React.FC = () => {
	const map = useMap()
	const loaded = useSelector(
		(state: StoreType) => Object.keys(state.ridgeGeometry.byId).length > 0
	)

	useEffect(() => {
		if (!loaded) {
			return
		}
		const control = new L.Control({ position: "bottomright" })
		control.onAdd = () => {
			const div = L.DomUtil.create("div", "leaflet-control-attribution")
			div.innerHTML = `${POLISH_FLAG} ${SLOVAK_FLAG} ${TEXT}`
			L.DomEvent.disableClickPropagation(div)
			return div
		}
		control.addTo(map)
		return () => {
			control.remove()
		}
	}, [loaded, map])

	return null
}

export default DataAttribution
