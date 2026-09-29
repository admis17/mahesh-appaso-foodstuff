import { Suspense, useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const ease = [0.76, 0, 0.24, 1]

function scrollToTarget(hash) {
  const el = hash && document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // Instant: the site-wide smooth scrolling would still be gliding when the curtain lifts.
  else window.scrollTo({ top: 0, behavior: 'instant' })
}

/**
 * Route changes: a deep-green curtain rises over the outgoing page, the scroll resets while it's
 * covered, then the curtain lifts off the incoming page. The first load skips it.
 */
export default function PageTransition() {
  const location = useLocation()
  const outlet = useOutlet()

  // Same-page hash links (e.g. /products#rice) don't remount, so handle them here.
  useEffect(() => {
    if (location.hash) scrollToTarget(location.hash)
  }, [location.hash])

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => scrollToTarget(location.hash)}>
      <motion.div key={location.pathname} exit={{ opacity: 1, transition: { duration: 0.5 } }}>
        {/* Lazy pages: a deep-green placeholder keeps the curtain's colour while the chunk loads. */}
        <Suspense fallback={<div className="min-h-screen bg-deep" />}>{outlet}</Suspense>
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[70] bg-deep flex items-center justify-center pointer-events-none"
          initial={{ y: '0%' }}
          animate={{ y: '-100%', transition: { duration: 0.55, ease, delay: 0.05 } }}
          exit={{ y: ['100%', '0%'], transition: { duration: 0.45, ease } }}
        >
          <svg viewBox="0 0 64 64" className="w-14 h-14">
            <circle cx="32" cy="32" r="31" fill="none" stroke="#D9A441" strokeOpacity="0.35" />
            <path d="M32 12c8 6 12 13 12 20s-4 14-12 20c-8-6-12-13-12-20s4-14 12-20Z" fill="none" stroke="#D9A441" strokeWidth="2.5" />
            <path d="M20.5 26h23M18 32h28M20.5 38h23" stroke="#D9A441" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
