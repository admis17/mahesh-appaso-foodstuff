import { useState } from 'react'
import { useMotionValueEvent } from 'framer-motion'

/**
 * Text typed out by scrolling: `progress` 0→1 reveals it character by character (and un-types
 * on the way back up). The full text sits invisibly underneath so the layout never moves, and
 * screen readers always get it whole.
 */
export default function ScrubText({ progress, text, className = '' }) {
  const [count, setCount] = useState(() => Math.round(progress.get() * text.length))
  useMotionValueEvent(progress, 'change', (p) => {
    const n = Math.round(p * text.length)
    setCount((c) => (c === n ? c : n))
  })
  const typing = count > 0 && count < text.length

  return (
    <span className={`relative block ${className}`}>
      <span className="invisible" aria-hidden="true">{text}</span>
      <span className="sr-only">{text}</span>
      <span className="absolute inset-0" aria-hidden="true">
        {text.slice(0, count)}
        {typing && <span className="inline-block w-px h-[1em] align-[-0.15em] bg-current" />}
      </span>
    </span>
  )
}
