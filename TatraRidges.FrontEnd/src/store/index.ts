import { configureStore } from "@reduxjs/toolkit"

import pointsReducer from "./map-slice"
import uiReducer from "./ui-slice"
import centerReducer from "./center-slice"
import routeFormReducer from "./route-form-slice"
import loginFormReducer from "./login-form.slice"


const store = configureStore({
	reducer: {
		map: pointsReducer,
		ui: uiReducer,
		center:centerReducer,
		routeForm:routeFormReducer,
		loginForm:loginFormReducer
	},
})

export default store
