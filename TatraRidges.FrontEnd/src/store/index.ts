import { configureStore } from "@reduxjs/toolkit"
import adminModeReducer from "./admin-mode-slice"
import pointsReducer from './map-slice'

const store = configureStore({
	reducer: {
		adminMode: adminModeReducer,
        map:pointsReducer
	},
})

export default store
