import { TatraData } from "../domain"
import { supabase } from "../supabase"
import { handleRequest, RequestProps } from "./local-api"

let cache: Promise<TatraData> | null = null

// All data comes from one RPC call per page load (get_tatra_data in supabase/migrations).
const loadTatraData = () => {
	if (cache === null) {
		cache = Promise.resolve(supabase.rpc<TatraData>("get_tatra_data")).then(
			({ data, error }) => {
				if (error) {
					throw new Error(`Błąd odczytu danych: ${error.message}`)
				}
				return data as TatraData
			}
		)
		cache.catch(() => {
			cache = null
		})
	}
	return cache
}

export const fetchFromSupabase = async (props: RequestProps) =>
	handleRequest(props, await loadTatraData())
