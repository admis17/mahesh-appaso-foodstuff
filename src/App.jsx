import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

// Home ships in the main bundle; every other page is fetched when first visited.
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const ProductCategory = lazy(() => import('./pages/ProductCategory'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Services = lazy(() => import('./pages/Services'))
const GlobalReach = lazy(() => import('./pages/GlobalReach'))
const Contact = lazy(() => import('./pages/Contact'))
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

export default function App() {
  return (
    <BrowserRouter>
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
          {Object.entries(legacyRedirects).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
