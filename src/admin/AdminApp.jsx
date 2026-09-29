import { lazy, Suspense, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Inbox, LayoutDashboard, Package, MessageSquareQuote, Globe2, Settings, LogOut, ExternalLink, Menu, X } from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabaseConfig'
import { db, isDemo, startDemo } from './client'
import useAdminSession from './useAdminSession'
import { Loading } from './ui'
import Login from './pages/Login'
import SetPassword from './pages/SetPassword'
import Setup from './pages/Setup'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Enquiries = lazy(() => import('./pages/Enquiries'))
const Products = lazy(() => import('./pages/Products'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Regions = lazy(() => import('./pages/Regions'))
const CompanySettings = lazy(() => import('./pages/CompanySettings'))

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/regions', label: 'Regions', icon: Globe2 },
  { to: '/admin/settings', label: 'Company details', icon: Settings },
]

function Shell({ user, children }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  const sidebar = (
    <nav className="flex flex-col gap-1">
      {nav.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
              isActive ? 'bg-gold text-deep' : 'text-ivory/75 hover:bg-ivory/10 hover:text-ivory'
            }`
          }
        >
          <n.icon className="w-4 h-4" /> {n.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-sand/40 lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden lg:flex flex-col bg-deep text-ivory p-5 sticky top-0 h-screen">
        <Link to="/admin" className="font-display text-xl font-semibold mb-1">Mahesh Admin</Link>
        <p className="text-xs text-ivory/50 mb-8">Content &amp; enquiries</p>
        {sidebar}
        <div className="mt-auto space-y-3 text-sm">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-ivory/70 hover:text-ivory">
            <ExternalLink className="w-4 h-4" /> View site
          </a>
          <p className="text-xs text-ivory/50 truncate" title={user.email}>{user.email}</p>
          <button type="button" onClick={() => db.auth.signOut()} className="flex items-center gap-2 text-ivory/70 hover:text-ivory">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Phone / tablet top bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-deep text-ivory flex items-center justify-between px-4 h-14">
        <span className="font-display text-lg font-semibold">Mahesh Admin</span>
        <button type="button" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)} className="p-2 -mr-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>
      {open && (
        <div className="lg:hidden bg-deep text-ivory px-4 pb-5 space-y-4 sticky top-14 z-30">
          {sidebar}
          <button type="button" onClick={() => db.auth.signOut()} className="flex items-center gap-2 text-sm text-ivory/70">
            <LogOut className="w-4 h-4" /> Sign out ({user.email})
          </button>
        </div>
      )}

      <main className="px-4 sm:px-8 py-8 max-w-6xl w-full">
        {isDemo && (
          <p className="mb-6 rounded-lg border border-gold/60 bg-gold/15 px-4 py-2.5 text-sm text-ink">
            <strong>Demo preview</strong> — sample data, kept only in this browser tab. Nothing is saved, and reloading resets it.
          </p>
        )}
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </div>
  )
}

function Gate() {
  const session = useAdminSession()
  const { pathname } = useLocation()

  // Reached from an invite or password-reset email: always allowed once signed in.
  if (pathname === '/admin/set-password') {
    if (session.status === 'loading') return <Loading label="Checking your link…" />
    return session.status === 'signedOut' ? <Navigate to="/admin/login" replace /> : <SetPassword />
  }

  if (session.status === 'loading') return <Loading label="Checking your sign-in…" />
  if (session.status === 'signedOut') return pathname === '/admin/login' ? <Login /> : <Navigate to="/admin/login" replace />
  if (session.status === 'notAdmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand/40 px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-semibold text-ink mb-3">No admin access</h1>
          <p className="text-sm text-slate mb-6">
            {session.user.email} is signed in but isn&apos;t on the admin list. Ask the site owner to add you, then sign in again.
          </p>
          <button type="button" onClick={() => db.auth.signOut()} className="text-sm font-semibold text-deep underline">
            Sign out
          </button>
        </div>
      </div>
    )
  }
  if (pathname === '/admin/login') return <Navigate to="/admin" replace />

  return (
    <Shell user={session.user}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="products" element={<Products />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="regions" element={<Regions />} />
        <Route path="settings" element={<CompanySettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  )
}

/** The admin area at /admin: private, not indexed, and separate from the public site's layout. */
export default function AdminApp() {
  const [demo, setDemo] = useState(isDemo)
  const preview = async () => {
    await startDemo()
    setDemo(true)
  }

  return (
    <>
      <title>Admin | Mahesh Rice Trading</title>
      <meta name="robots" content="noindex, nofollow" />
      {isSupabaseConfigured || demo ? <Gate /> : <Setup onPreview={preview} />}
    </>
  )
}
