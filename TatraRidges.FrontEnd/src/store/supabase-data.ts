import { TatraData } from "../domain"
import { hasStoredSession, publicRpc } from "../supabase-rest"
import { handleRequest, RequestProps } from "./local-api"
import { RidgeGeometry } from "./ridge-geometry"

// Visitors' reads go through plain fetch (supabase-rest.ts). The admin's sign-in and
// writes need the Supabase SDK, which comes with supabase-admin.ts, loaded on demand.
const admin = () => import("./supabase-admin")

let cache: Promise<TatraData> | null = null

// All data comes from one RPC call per page load (get_tatra_data in supabase/migrations)
// and again after every write.
const loadTatraData = () => {
	if (cache === null) {
		cache = publicRpc<TatraData>("get_tatra_data").catch(error => {
			cache = null
			throw new Error(`Błąd odczytu danych: ${error.message}`)
		})
	}
	return cache
}

// Ridge lines and profiles (migration ridge_geometry), separate from get_tatra_data()
// because the map is usable without them.
export const loadRidgeGeometry = () =>
	publicRpc<RidgeGeometry[]>("get_ridge_geometry")

let sessionChanged: (isAdmin: boolean) => void = () => {}

// The admin module, with the session's end reported to watchAdminSession's listener.
const loadAdmin = async () => {
	const module = await admin()
	module.onSignedOut(() => sessionChanged(false))
	return module
}

// Reports whether there is an admin session on page load, then reports false whenever
// the session ends. Without a stored session the SDK is not loaded.
export const watchAdminSession = async (onChange: (isAdmin: boolean) => void) => {
	sessionChanged = onChange
	if (!hasStoredSession()) {
		onChange(false)
		return
	}
	onChange(await (await loadAdmin()).isAdminSession())
}

export const signOutFromSupabase = async () => (await loadAdmin()).signOut()

const writes = ["PUT point/", "DELETE point/", "POST connection", "POST route"]

export const fetchFromSupabase = async (props: RequestProps) => {
	if (props.method === "POST" && props.location === "account/login/") {
		return (await loadAdmin()).signIn(
			props.body as { email: string; password: string }
		)
	}

	if (writes.includes(`${props.method} ${props.location}`)) {
		const result = await (await loadAdmin()).write(props)
		cache = null
		return result
	}

	return handleRequest(props, await loadTatraData())
}
