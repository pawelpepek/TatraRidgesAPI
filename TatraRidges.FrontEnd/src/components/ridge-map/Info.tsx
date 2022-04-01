import PanelHeader from "../left-panel/PanelHeader"
import classes from "./Info.module.css"

const Info: React.FC = () => {
	return (
		<section>
			<div className={classes.text}>
				<PanelHeader text='Pamiętaj!' />
				<p>Tatry to najniebezpieczniejsze góry w Polsce i na Słowacji!</p>
				<p>
					Trasy zaznaczone na mapie prowadzą często terenem wymagającym obycia
					górskiego oraz doświadczenia wspinaczkowego (w tym znajomości technik
					asekuracji).
				</p>
				<p>
					Część tras prowadzi także terenem nieudostępnionym dla działalności
					wspinaczkowej.
				</p>
				<p>
					Góry są piekną pasją ale wymagają roztropności, bo nieodpowiedzialność
					i brawura mogą zakończyć się śmiercią lub kalectwem.
				</p>
			</div>
		</section>
	)
}

export default Info
