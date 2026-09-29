import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductCategory from './pages/ProductCategory'
import ProductDetail from './pages/ProductDetail'
import Services from './pages/Services'
import GlobalReach from './pages/GlobalReach'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

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
