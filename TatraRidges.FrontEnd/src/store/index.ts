import { configureStore } from "@reduxjs/toolkit"

import pointsReducer from "./map-slice"
import uiReducer from "./ui-slice"
import centerReducer from "./center-slice"

const store = configureStore({
	reducer: {
		map: pointsReducer,
		ui: uiReducer,
		center:centerReducer
	},
})

export default store
