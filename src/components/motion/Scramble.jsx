import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const GLYPHS = '0123456789█▓▒░#'

/** Text that "decodes" once scrolled into view: characters churn, then lock in left to right. */
export default function Scramble({ text, delay = 0, duration = 900, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [shown, setShown] = useState(text)

  useEffect(() => {
    if (reduce || !inView) return
    let raf
    let start
    const tick = (t) => {
      start ??= t + delay * 1000
      const p = Math.max(0, Math.min(1, (t - start) / duration))
      const locked = Math.floor(p * text.length)
      setShown(
        [...text]
          .map((ch, i) => (i < locked || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      )
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, text, delay, duration])

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}
