import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const DECOYS = ['Mumbai', 'Jebel Ali', 'Mombasa', 'Rotterdam', 'Colombo', 'Port Klang', 'Djibouti', 'Chennai']

/**
 * A word that spins in like a slot-machine reel: a column of decoy place names scrolls past
 * and lands on `word`. The final word also sizes the window, so nothing shifts.
 */
export default function SlotReel({ word, delay = 0, spins = 5, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [line, setLine] = useState(0)
  const reel = [...Array.from({ length: spins }, (_, i) => DECOYS[(i + word.length) % DECOYS.length]), word]

  // Travel is measured in pixels (one line per decoy); percentage offsets don't animate reliably here.
  useLayoutEffect(() => {
    setLine(ref.current.offsetHeight)
  }, [])

  return (
    <span ref={ref} className={`relative inline-block overflow-hidden align-bottom ${className}`} aria-label={word}>
      <span className="invisible" aria-hidden="true">{word}</span>
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: line && (inView || reduce) ? -spins * line : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 1.3, delay, ease: [0.2, 0.9, 0.3, 1] }}
      >
        {reel.map((w, i) => (
          <span key={i} className="block whitespace-nowrap">{w}</span>
        ))}
      </motion.span>
    </span>
  )
}
