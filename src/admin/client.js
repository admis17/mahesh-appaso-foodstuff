import { supabase } from '../lib/supabase'

// Every admin screen talks to the database through `db`: the real Supabase client, or — after
// startDemo() — the in-browser sample-data client. ES module exports are live bindings, so
// switching here switches it for every importer.
export let db = supabase
export let isDemo = false

export async function startDemo() {
  const { createDemoClient } = await import('./demoClient')
  db = createDemoClient()
  isDemo = true
}
