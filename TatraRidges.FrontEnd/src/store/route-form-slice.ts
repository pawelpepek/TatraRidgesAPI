import { createSlice } from "@reduxjs/toolkit"
import { fillObject, objectIsFilled } from "./filler"
import { RouteType, Difficulty, Adjective, Guide } from "./routeTypes"

export interface OptionsProps {
	value: string
	label: string
}

export interface RouteFormValues {
	isRunning: boolean
	containerValues: {
		guides: Guide[]
		routeTypes: RouteType[]
		difficulties: Difficulty[]
		adjectives: Adjective[]
	}
	consistentDirection: boolean
	guide: number
	volume: number | null
	number: string
	difficulty: number
	adjectives: string[]
	routeTypeId: Number
	rappeling: boolean
	page: number | null
	routeTime: Date | null
	isFilled: boolean
}

const initialState: RouteFormValues = {
	isRunning: false,
	containerValues: {
		guides: [],
		difficulties: [],
		adjectives: [],
		routeTypes: [],
	},
	consistentDirection: false,
	guide: 1,
	volume: 1,
	number: "",
	difficulty: 0,
	adjectives: [],
	routeTypeId: 1,
	rappeling: false,
	page: null,
	routeTime: null,
	isFilled: false,
}

const routeFormSlice = createSlice({
	name: "routeForm",
	initialState,
	reducers: {
		setValue(state, action) {
			const name: string = action.payload.name
			const value = action.payload.value
			fillObject(state, name, value)
			state.isFilled = objectIsFilled(state, ["adjectives"])
		},
		clear(state, action) {
			state.isFilled = false
			state.number = ""
			state.adjectives = []
			state.page = null
			state.routeTime = null
			state.rappeling = false
			state.consistentDirection = false
		},
		setValuesContainer(state, action) {
			state.containerValues = action.payload.data
		},
	},
})

export const routeFormActions = routeFormSlice.actions

export default routeFormSlice.reducer
