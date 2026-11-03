import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"

import "leaflet/dist/leaflet.css"
import "./index.css"
import App from "./App"
import store from "./store/index"
import { syncLogin } from "./store/user-actions"
import { startUrlSync } from "./store/url-sync"

store.dispatch(syncLogin())
startUrlSync(store)

createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</Provider>
)
