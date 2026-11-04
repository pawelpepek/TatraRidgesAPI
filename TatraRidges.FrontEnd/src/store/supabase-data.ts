import { AddRouteInput, Coordinates, TatraData } from "../domain"
import { getSupabase } from "../supabase"
import { handleRequest, RequestProps } from "./local-api"
import { RidgeGeometry } from "./ridge-geometry"
import { getMessage } from "./statusCodeMessage"

let cache: Promise<TatraData> | null = null

const rpc = async <T>(fn: string, args?: Record<string, unknown>) => {
	const { data, error } = await getSupabase().rpc(fn, args)
	if (error) {
		throw new Error(error.message)
	}
	return data as T
}

// All data comes from one RPC call per page load (get_tatra_data in supabase/migrations)
// and again after every write.
const loadTatraData = () => {
	if (cache === null) {
		cache = rpc<TatraData>("get_tatra_data").catch(error => {
			cache = null
			throw new Error(`Błąd odczytu danych: ${error.message}`)
		})
	}
	return cache
}

// Ridge lines and profiles (migration ridge_geometry), separate from get_tatra_data()
// because the map is usable without them.
export const loadRidgeGeometry = () => rpc<RidgeGeometry[]>("get_ridge_geometry")

// Resolves to true for an admin; supabase-js keeps the session in localStorage.
const signIn = async (credentials: { email: string; password: string }) => {
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

export const signOutFromSupabase = () => getSupabase().auth.signOut()

// Reports whether the session found on page load belongs to an admin, then reports
// false whenever the session ends (expired, revoked, signed out in another tab).
export const watchAdminSession = async (onChange: (isAdmin: boolean) => void) => {
	getSupabase().auth.onAuthStateChange(event => {
		if (event === "SIGNED_OUT") {
			onChange(false)
		}
	})
	const { data } = await getSupabase().auth.getSession()
	onChange(data.session !== null && (await rpc<boolean>("is_admin")))
}

// The writes of the old API, as SQL functions (migration admin_writes).
const write = async (props: RequestProps) => {
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
			return undefined
	}
}

export const fetchFromSupabase = async (props: RequestProps) => {
	if (props.method === "POST" && props.location === "account/login/") {
		return signIn(props.body as { email: string; password: string })
	}

	const result = await write(props)
	if (result !== undefined) {
		cache = null
		return result
	}

	return handleRequest(props, await loadTatraData())
}
