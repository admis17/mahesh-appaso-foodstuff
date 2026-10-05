import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'

// Home ships in the main bundle; every other page is fetched when first visited.
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const ProductCategory = lazy(() => import('./pages/ProductCategory'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Services = lazy(() => import('./pages/Services'))
const GlobalReach = lazy(() => import('./pages/GlobalReach'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))
// Admin area: its own chunk, only downloaded by people who open /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'))

// Old URLs from the previous site map — kept so existing links still land somewhere.
const legacyRedirects = {
  '/about': '/company',
  '/services': '/trade',
  '/global-reach': '/markets',
  '/products/basmati-rice': '/products/rice',
  '/products/non-basmati-rice': '/products/rice',
}

// Route changes start at the top — the SPA shell otherwise keeps the old scroll position.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-deep" />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetail />} />
          <Route path="/trade" element={<Services />} />
          <Route path="/markets" element={<GlobalReach />} />
          <Route path="/company" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {Object.entries(legacyRedirects).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
