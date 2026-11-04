import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchRidgeGeometry } from "./dispatch-actions"
import { RidgeGeometry } from "./ridge-geometry"
import type { AppDispatch } from "./index"

const initialState = {
	byId: {} as Record<number, RidgeGeometry>,
}

const ridgeGeometrySlice = createSlice({
	name: "ridgeGeometry",
	initialState,
	reducers: {
		replace(state, action: PayloadAction<RidgeGeometry[]>) {
			state.byId = Object.fromEntries(action.payload.map(g => [g.id, g]))
		},
	},
})

export const ridgeGeometryActions = ridgeGeometrySlice.actions

// Loaded once in the background; without it ridges are drawn straight, as before.
export const loadRidgeGeometry = () => async (dispatch: AppDispatch) => {
	try {
		dispatch(ridgeGeometryActions.replace(await fetchRidgeGeometry()))
	} catch (error) {
		console.warn("Brak linii i profili grani:", error)
	}
}

export default ridgeGeometrySlice.reducer
