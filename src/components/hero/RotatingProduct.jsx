import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { getProductsByCategory } from '../../data/products'

// Alternate rice and pulses so the headline shows both commodity lines early.
const rice = getProductsByCategory('rice').map((p) => p.shortName)
const pulses = getProductsByCategory('pulses').map((p) => p.shortName)
const words = ['Rice & Pulses']
for (let i = 0; i < Math.max(rice.length, pulses.length); i++) {
  if (rice[i]) words.push(rice[i])
  if (pulses[i]) words.push(pulses[i])
}

/** Cycles the headline's first line through the live product list. */
export default function RotatingProduct({ startDelay = 2500, interval = 2600 }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    let timer
    const start = setTimeout(() => {
      timer = setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
    }, startDelay)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [reduce, startDelay, interval])

  return (
    <span className="relative inline-flex whitespace-nowrap" aria-hidden="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: '0.45em', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-0.45em', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {words[index]},
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
