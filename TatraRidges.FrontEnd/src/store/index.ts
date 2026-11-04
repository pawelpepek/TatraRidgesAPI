import { configureStore } from "@reduxjs/toolkit"

import pointsReducer from "./map-slice"
import uiReducer from "./ui-slice"
import centerReducer from "./center-slice"
import routeFormReducer from "./route-form-slice"
import loginFormReducer from "./login-form.slice"
import ridgeGeometryReducer from "./ridge-geometry-slice"


const store = configureStore({
	reducer: {
		map: pointsReducer,
		ui: uiReducer,
		center:centerReducer,
		routeForm:routeFormReducer,
		loginForm:loginFormReducer,
		ridgeGeometry: ridgeGeometryReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
