import { createSlice } from "@reduxjs/toolkit"

export interface LoginFormValues {
	email: string
	password: string
	isFilled: boolean
}

const initialState: LoginFormValues = {
	email: "",
	password: "",
	isFilled: false,
}

const isFilled = (state: LoginFormValues) =>
	state.email.trim().length > 0 && state.password.trim().length > 0

const loginFormSlice = createSlice({
	name: "routeForm",
	initialState,
	reducers: {
		setEmail(state, action) {
			state.email = action.payload
			state.isFilled = isFilled(state)
		},
		setPassword(state, action) {
			state.password = action.payload
			state.isFilled = isFilled(state)
		},
	},
})

export const loginFormActions = loginFormSlice.actions

export default loginFormSlice.reducer
