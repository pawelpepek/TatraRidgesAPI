import { createClient } from "@supabase/supabase-js"

// The project URL and the publishable (anon) key are public by design; access is
// limited by grants and row level security in the database (see supabase/migrations).
// The admin's session is kept in localStorage by supabase-js.
export const supabase = createClient(
	process.env.REACT_APP_SUPABASE_URL as string,
	process.env.REACT_APP_SUPABASE_KEY as string
)
