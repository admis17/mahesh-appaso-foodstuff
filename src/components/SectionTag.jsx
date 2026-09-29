import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrub } from './motion/useScrub'

// The rule grows as the label scrolls up into view and shrinks back if you scroll up past it.
export default function SectionTag({ children, light = false, className = '' }) {
  const ref = useRef(null)
  const progress = useScrub(ref, ['start 98%', 'start 70%'])

  return (
    <span ref={ref} className={`eyebrow inline-flex items-center gap-3 ${light ? 'text-gold-light' : 'text-rust'} ${className}`}>
      <motion.span style={{ scaleX: progress }} className={`h-px w-8 origin-left ${light ? 'bg-gold-light' : 'bg-rust'}`} />
      {children}
    </span>
  )
}
