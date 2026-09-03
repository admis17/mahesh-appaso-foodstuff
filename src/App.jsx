import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import BasmatiRice from './pages/BasmatiRice'
import NonBasmatiRice from './pages/NonBasmatiRice'
import Services from './pages/Services'
import GlobalReach from './pages/GlobalReach'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/basmati-rice" element={<BasmatiRice />} />
          <Route path="/products/non-basmati-rice" element={<NonBasmatiRice />} />
          <Route path="/services" element={<Services />} />
          <Route path="/global-reach" element={<GlobalReach />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
