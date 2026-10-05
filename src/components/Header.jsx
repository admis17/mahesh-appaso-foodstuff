import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Mail, MapPin } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { company } from '../data/company'
import Button from './Button'
import SocialLinks from './SocialLinks'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/company', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/trade', label: 'Services' },
  { to: '/markets', label: 'Global Reach' },
  { to: '/contact', label: 'Contact' },
]

function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-3 shrink-0">
      <img
        src="/logo-sm.webp"
        alt="MA Foods Stuff logo"
        fetchpriority="high"
        decoding="async"
        className={`shrink-0 w-auto rounded-md transition-all duration-300 ${compact ? 'h-8 sm:h-9' : 'h-9 sm:h-10'}`}
      />
      <span className="leading-tight">
        <span className="block font-display font-semibold text-lg sm:text-xl text-ink tracking-tight whitespace-nowrap">MA Foods Stuff</span>
      </span>
    </Link>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [compact, setCompact] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      setCompact(window.scrollY > 120)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Utility bar */}
      <div className="hidden md:block bg-deep text-ivory/80">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-gold-light transition-colors">
              <Mail className="w-3.5 h-3.5" /> {company.email}
            </a>
            <span className="flex items-center gap-2 text-ivory/70">
              <MapPin className="w-3.5 h-3.5" /> {company.address.city}, {company.address.country}
            </span>
          </div>
          <SocialLinks iconClassName="w-3.5 h-3.5" className="text-ivory/70 [&_a]:w-7 [&_a]:h-7" />
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ivory/95 backdrop-blur shadow-[0_1px_0_0_rgba(23,32,27,0.08)]' : 'bg-ivory'}`}>
        <div className={`max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between transition-[height] duration-300 ${compact ? 'h-14 sm:h-16' : 'h-18 sm:h-20'}`}>
          <Logo compact={compact} />

          <nav className="hidden lg:flex items-center gap-9">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors ${isActive ? 'text-deep' : 'text-slate hover:text-deep'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button to="/contact" size="sm" variant="deep">Get a Quote</Button>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 -mr-2 text-ink"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Reading progress */}
        <motion.div
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-gold via-gold-light to-gold"
          style={{ scaleX: progress }}
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden bg-deep text-ivory pt-20"
          >
            <nav className="flex flex-col px-8 py-8 gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-4 border-b border-ivory/10 font-display text-2xl ${isActive ? 'text-gold' : 'text-ivory'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * navItems.length, duration: 0.3 }}
                className="mt-6 flex flex-col gap-5"
              >
                <Button to="/contact" onClick={() => setOpen(false)} variant="gold">Get a Quote</Button>
                <SocialLinks className="text-ivory/80" />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
