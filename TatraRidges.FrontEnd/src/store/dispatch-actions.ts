import type { Dispatch, UnknownAction } from "@reduxjs/toolkit"
import type { RequestProps } from "./local-api"
import { fetchFromSupabase } from "./supabase-data"
import { uiActions } from "./ui-slice"

// The data comes from Supabase (get_tatra_data, the admin's SQL functions) and is
// computed locally; supabase-data.ts loads the SDK only for the admin.
export {
	loadRidgeGeometry as fetchRidgeGeometry,
	signOutFromSupabase as signOut,
	watchAdminSession as watchSession,
} from "./supabase-data"

export interface DispatchProps extends RequestProps {
	// Shows the spinner with the data sources (the first loads of the map).
	pendingInfo?: boolean
	// Passed to the action creators next to `body` and `data`.
	addingInfo?: Record<string, unknown>
}

type ActionCreator = (payload?: any) => UnknownAction

const getTitleFromMethod = (method: string) => {
	switch (method) {
		case "POST":
			return "Wgrywanie"
		case "PUT":
			return "Aktualizacja"
		case "DELETE":
			return "Usuwanie"
		case "GET":
			return "Wczytywanie"
		default:
			throw new Error("Niepoprawna metoda łączenia z bazą danych!")
	}
}

// Runs the request with the notifications around it and passes the result to the
// action creators. Resolves to true when the request succeeded.
const dataDispatcher = (
	props: DispatchProps,
	dispatcher: ActionCreator | ActionCreator[]
) => {
	const title = getTitleFromMethod(props.method)

	return async (dispatch: Dispatch) => {
		dispatch(
			uiActions.showNotification({
				status: props.pendingInfo ? "pendingInfo" : "pending",
				message: title + " danych...",
			})
		)
		try {
			const data = await fetchFromSupabase(props)

			dispatch(uiActions.showNotification({ status: "success", message: "Ok" }))
			if (data) {
				const withPayload =
					props.body != null || data !== true || props.addingInfo !== undefined
				for (const creator of Array.isArray(dispatcher)
					? dispatcher
					: [dispatcher]) {
					dispatch(
						withPayload
							? creator({ body: props.body, data, ...props.addingInfo })
							: creator()
					)
				}
				return true
			}
		} catch (error) {
			dispatch(
				uiActions.showNotification({
					status: "error",
					message: (error as Error).message,
				})
			)
		}
		return false
	}
}

export default dataDispatcher
