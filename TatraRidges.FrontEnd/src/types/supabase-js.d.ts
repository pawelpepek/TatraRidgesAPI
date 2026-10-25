// supabase-js ships its types as .d.cts/.d.mts, which TypeScript 4.5 (pinned by
// Create React App 5) cannot read. This declares only the part of the API the app
// uses; remove it once the project moves to TypeScript 4.7 or newer.
declare module "@supabase/supabase-js" {
	export interface SupabaseError {
		message: string
	}

	export interface SupabaseResponse<T> {
		data: T | null
		error: SupabaseError | null
	}

	export interface Session {
		access_token: string
	}

	export interface SupabaseAuthClient {
		signInWithPassword(credentials: {
			email: string
			password: string
		}): Promise<{
			data: { session: Session | null }
			error: SupabaseError | null
		}>
		signOut(): Promise<{ error: SupabaseError | null }>
	}

	export interface SupabaseClient {
		auth: SupabaseAuthClient
		rpc<T = unknown>(
			fn: string,
			args?: Record<string, unknown>
		): PromiseLike<SupabaseResponse<T>>
	}

	export function createClient(
		url: string,
		key: string,
		options?: Record<string, unknown>
	): SupabaseClient
}
