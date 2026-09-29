import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { whatsappLink } from '../data/company'

const MESSAGE = "Hello, I'd like to enquire about your rice and pulses."
const SEEN_KEY = 'wa-nudge-seen'
const SHOW_AFTER = 5000
const HIDE_AFTER = 20000

// Storage can be blocked (private mode, disabled site data) — never let that break the button.
const seen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* ignore */
  }
}

export default function WhatsAppFloat() {
  const [nudge, setNudge] = useState(false)

  // Show the chat prompt once per visit, a few seconds after landing.
  useEffect(() => {
    if (seen()) return
    const show = setTimeout(() => {
      setNudge(true)
      markSeen()
    }, SHOW_AFTER)
    const hide = setTimeout(() => setNudge(false), SHOW_AFTER + HIDE_AFTER)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex items-end gap-3">
      <AnimatePresence>
        {nudge && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="relative mb-2 max-w-[15rem] rounded-2xl rounded-br-sm bg-ivory text-ink shadow-xl shadow-black/20 border border-line/60 pl-4 pr-9 py-3 origin-bottom-right"
          >
            <a href={whatsappLink(MESSAGE)} target="_blank" rel="noreferrer" className="block text-sm leading-snug">
              Need a price for <strong>IR64</strong> or <strong>pulses</strong>?{' '}
              <span className="text-[#128C7E] font-semibold">Chat with us.</span>
            </a>
            <button
              type="button"
              onClick={() => setNudge(false)}
              aria-label="Dismiss"
              className="absolute top-2 right-2 p-1 rounded-full text-slate hover:text-ink hover:bg-sand transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={whatsappLink(MESSAGE)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="shrink-0 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" fill="white" strokeWidth={0} />
      </a>
    </div>
  )
}
