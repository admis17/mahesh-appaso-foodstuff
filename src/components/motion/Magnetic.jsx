import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import useMediaQuery, { FINE_POINTER } from './useMediaQuery'

/**
 * Makes its child lean toward the cursor, springing back when the cursor leaves.
 * Mouse/trackpad only (no cursor to follow on touch) and off for reduced motion.
 * `strength` scales the pull; padding widens the catch area so it starts before contact.
 */
export default function Magnetic({ children, strength = 1, enabled = true }) {
  const fine = useMediaQuery(FINE_POINTER)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 15 })
  const sy = useSpring(y, { stiffness: 220, damping: 15 })

  if (!enabled || !fine || reduce) return children

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35 * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.45 * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span className="inline-flex -m-4 p-4" onPointerMove={onMove} onPointerLeave={reset} style={{ x: sx, y: sy }}>
      {children}
    </motion.span>
  )
}
