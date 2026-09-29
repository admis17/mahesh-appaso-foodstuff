import { useRef } from 'react'
import { useMotionValueEvent } from 'framer-motion'

const format = (v, pad) => String(Math.round(v)).padStart(pad, '0')

/**
 * A number that counts with scroll: `progress` 0→1 maps to 0→`to`, and runs back down when the
 * visitor scrolls up. The final value is rendered first so crawlers and no-JS see the real figure.
 */
export default function ScrubNumber({ progress, to, pad = 1 }) {
  const ref = useRef(null)
  useMotionValueEvent(progress, 'change', (p) => {
    if (ref.current) ref.current.textContent = format(p * to, pad)
  })
  return <span ref={ref}>{format(progress.get() * to, pad)}</span>
}
