import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './supabaseConfig'

// The anon key is meant to be public: row-level security in supabase/schema.sql decides what it can do.
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null
export { isSupabaseConfigured }
