// Set in .env.local (dev) and in Vercel → Project → Settings → Environment Variables (live).
// Kept apart from ./supabase so checking the flag doesn't pull the Supabase library into the
// main bundle — the client itself is only loaded where it's used.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
