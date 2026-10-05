import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { isSupabaseConfigured } from './lib/supabaseConfig'

// With Supabase configured, admin-managed content is loaded before the app first renders, so
// every component sees it from the start. Without it (or if it's slow), the built-in data is used.
// The admin area fetches its own data, so it skips this.
async function boot() {
  if (isSupabaseConfigured && !window.location.pathname.startsWith('/admin')) {
    try {
      const { loadSiteData } = await import('./data/remote')
      const result = await loadSiteData()
      if (result.reason || result.errors?.length) {
        if (import.meta.env.DEV) console.warn('Site content:', result)
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Site content: using built-in data —', err)
    }
  }

  const { default: App } = await import('./App.jsx')
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

boot()
