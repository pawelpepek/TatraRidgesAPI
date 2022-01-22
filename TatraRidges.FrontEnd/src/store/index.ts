import { configureStore } from "@reduxjs/toolkit"

import adminModeReducer from "./admin-mode-slice"
import pointsReducer from "./map-slice"
import uiReducer from "./ui-slice"

const store = configureStore({
	reducer: {
		adminMode: adminModeReducer,
		map: pointsReducer,
		ui: uiReducer,
	},
})

export default store
