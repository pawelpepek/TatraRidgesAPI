import classes from "./HelpPanel.module.css"
import infoImg1 from "../../img/help1.png"
import infoImg2 from "../../img/help2.png"
import infoImg3 from "../../img/help3.png"
import infoImg4 from "../../img/help4.png"
import infoImg5 from "../../img/help5.png"
import infoImg6 from "../../img/help6.png"
import PanelHeader from "../PanelHeader"

const HelpPanel: React.FC = () => {
	return (
		<>
			<PanelHeader text='Instrukcja' />
			<section className={classes["info"]}>
				<h4>Wyszukiwanie</h4>
				<p>
					Żeby wyszukać połączenie graniowe pomiędzy dwoma
					szczytami/przełęczami, należy zaznaczyć lewym przyciskiem myszy punkty
					jeden po drugim. Szczyty są oznaczone na mapie trójkątem, a przełęcze
					znakiem )( ułożonym wzdłuż grani.
				</p>
				<img
					alt='Zaznaczanie punktu początkowego'
					className={classes.img}
					src={infoImg1}
				/>
				<img
					alt='Zaznaczanie punktu końcowego'
					className={classes.img}
					src={infoImg2}
				/>
				<p>Następnie trzeba nacisnąć przycisk Wyszukaj.</p>
				<img alt='Wyszukiwanie dróg' className={classes.img} src={infoImg3} />
				<h4>Zmiana wariantu</h4>
				<span>
					Domyślnie wyszukana trasa podaje domyślny wariant drogi, który jest
					dobierany według następującego klucza:
					<ol>
						<li>zgodna z wybranym kierunkiem</li>
						<li>
							po grani
							<ul>
								<li>prawie ściśle granią</li>
								<li>ściśle granią</li>
								<li>obchodząc grań</li>
							</ul>
						</li>
						<li>o najwyższym rankingu</li>
						<li>o najmniejszej trudności</li>
						<li>bez zjazdu</li>
						<li>o najkrótszym czasie</li>
					</ol>
				</span>
				<p>
					Jeśli istnieje więcej niż jeden wariant drogi, przy odcinku pojawi się
					ruszająca się ikonka z liczbą pozostałych wariantów (np. +1).
				</p>
				<img
					alt='Ikonka alternatywnych wariantów'
					className={classes.img}
					src={infoImg4}
				/>
				<p>
					Po kliknięciu tej ikonki wyświetli się lista dostępnych wariantów.
				</p>
				<p>
					Żeby zmienić wariant drogi, należy zaznaczyć puste zielone kółeczko
					wybranego wariantu.
				</p>
				<img
					alt='Wybieranie wariantu alternatywnego'
					className={classes.img}
					src={infoImg5}
				/>
				<p>Trasa zostanie przeliczona na nowo.</p>
				<h4>Zmiana kolejności punktów</h4>
				<p>
					Żeby zmienić kolejność punktów, należy kliknąć przycisk ze strzałkami.
				</p>
				<img
					alt='Zmiana kolejności punktów'
					className={classes.img}
					src={infoImg6}
				/>
				<h4>Linie i profil grani</h4>
				<p>
					Linie grani na mapie i profil wysokościowy trasy są wyznaczone z
					lotniczego skaningu laserowego terenu. Przy drogach „prawie ściśle
					granią” profil pomija drobne zęby grani, a przy „obchodząc grań” także
					większe turnie.
				</p>
				<p>
					Źródła danych (przetworzonych): NMT ©{" "}
					<a href='https://www.geoportal.gov.pl' target='_blank' rel='noopener'>
						GUGiK
					</a>
					;{" "}
					<a
						href='https://www.skgeodesy.sk/geoportal/inspire/udaje-stiahnutie/'
						target='_blank'
						rel='noopener'>
						DMR 5.0
					</a>{" "}
					©{" "}
					<a href='https://www.skgeodesy.sk' target='_blank' rel='noopener'>
						ÚGKK SR
					</a>
					, licencja{" "}
					<a
						href='https://creativecommons.org/licenses/by/4.0/deed.pl'
						target='_blank'
						rel='noopener'>
						CC BY 4.0
					</a>
					.
				</p>
				<p>
					Nazwy, wysokości i położenie punktów opracowano m.in. na podstawie{" "}
					<a href='https://pl.wikipedia.org' target='_blank' rel='noopener'>
						Wikipedii
					</a>
					, a opisy dróg na podstawie przewodników W.H. Paryskiego i W.
					Cywińskiego.
				</p>
			</section>
		</>
	)
}

export default HelpPanel
