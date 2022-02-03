// test-utils.jsx
import { render as rtlRender } from "@testing-library/react"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
// Import your own reducer
import uiReducer from "../../store/ui-slice"
import routeFormReducer from "../../store/route-form-slice"

const storeConfiguration = storeName => {
	switch (storeName) {
		case "ui":
			return { ui: uiReducer }
		case "routeForm":
			return { routeForm: routeFormReducer }
		default:
			return undefined
	}
}

function renderWithReducer(
	ui,
	selectedReducer,
	{
		preloadedState,
		store = configureStore({ reducer: selectedReducer, preloadedState }),
		...renderOptions
	} = {}
) {
	function Wrapper({ children }) {
		return <Provider store={store}>{children}</Provider>
	}
	return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}
function renderWithInitialReducer(ui, storeName) {
	const store = storeConfiguration(storeName)
	return renderWithReducer(ui, store)
}

// re-export everything
export * from "@testing-library/react"
// override render method
export { renderWithInitialReducer , renderWithReducer}
