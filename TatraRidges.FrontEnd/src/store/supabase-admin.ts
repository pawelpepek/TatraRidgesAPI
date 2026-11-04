import { AddRouteInput, Coordinates } from "../domain"
import { getSupabase } from "../supabase"
import type { RequestProps } from "./local-api"
import { getMessage } from "./statusCodeMessage"

// The admin's part, with the Supabase SDK: sign-in, the session and the writes.
// Loaded on demand by supabase-data.ts, so visitors never download the SDK.

const rpc = async <T>(fn: string, args?: Record<string, unknown>) => {
	const { data, error } = await getSupabase().rpc(fn, args)
	if (error) {
		throw new Error(error.message)
	}
	return data as T
}

// Resolves to true for an admin; supabase-js keeps the session in localStorage.
export const signIn = async (credentials: { email: string; password: string }) => {
	const { data, error } =
		await getSupabase().auth.signInWithPassword(credentials)
	if (error?.code === "invalid_credentials" || (!error && !data.session)) {
		throw new Error("Niepoprawny e-mail lub hasło")
	}
	if (error || !data.session) {
		throw new Error(`Błąd logowania: ${error?.message}`)
	}

	let isAdmin = false
	try {
		isAdmin = await rpc<boolean>("is_admin")
	} finally {
		// Also when the check itself failed: no session is left behind.
		if (!isAdmin) {
			await getSupabase().auth.signOut()
		}
	}
	if (!isAdmin) {
		throw new Error(getMessage(401))
	}
	return true
}

export const signOut = () => getSupabase().auth.signOut()

// Whether the stored session belongs to an admin.
export const isAdminSession = async () => {
	const { data } = await getSupabase().auth.getSession()
	return data.session !== null && (await rpc<boolean>("is_admin"))
}

let signedOut = () => {}
let listening = false

// Calls `listener` whenever the session ends (expired, revoked, signed out in
// another tab); a later call replaces the listener.
export const onSignedOut = (listener: () => void) => {
	signedOut = listener
	if (!listening) {
		listening = true
		getSupabase().auth.onAuthStateChange(event => {
			if (event === "SIGNED_OUT") {
				signedOut()
			}
		})
	}
}

// The writes of the old API, as SQL functions (migration admin_writes).
export const write = async (props: RequestProps) => {
	switch (`${props.method} ${props.location}`) {
		case "PUT point/": {
			const coordinates = props.body as Coordinates
			await rpc("move_point", {
				point_id: Number(props.pathPart),
				latitude: coordinates.latitude,
				longitude: coordinates.longitude,
			})
			return true
		}
		case "DELETE point/":
			await rpc("delete_point", { point_id: Number(props.pathPart) })
			return true
		case "POST connection": {
			const body = props.body as { pointId1: number; pointId2: number }
			return rpc<number>("add_connection", {
				point_id1: body.pointId1,
				point_id2: body.pointId2,
			})
		}
		case "POST route":
			return rpc("add_route", { route: props.body as AddRouteInput })
		default:
			throw new Error(`Nieznany zapis ${props.method} ${props.location}`)
	}
}
