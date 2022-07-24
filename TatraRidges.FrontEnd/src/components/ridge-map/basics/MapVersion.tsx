export const getMapVersion = (version: number) => {
	if (version === 0) {
		return {
			attribution:
				'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
			url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
		}
	} else {
		return {
			attribution:
				'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			url: "https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=UyD1GGYvwAIfLLzHKJ5tXAze8N20ZF2bXnD8hmUqUD8BkWPnNDlH7mo2qujD0E33",
		}
	}
}
