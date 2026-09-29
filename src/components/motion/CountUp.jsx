import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

const format = (v, pad) => String(Math.round(v)).padStart(pad, '0')

/**
 * Counts from 0 to `to` once — on mount, or when scrolled into view with `onView`.
 * Renders the final value up front so reduced-motion users and crawlers see the real number.
 */
export default function CountUp({ to, delay = 0, duration = 1.4, pad = 2, onView = false, onDone }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const go = !onView || inView
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  }, [onDone])

  useEffect(() => {
    const node = ref.current
    if (reduce || !node) {
      if (go) done.current?.()
      return
    }
    node.textContent = format(0, pad)
    if (!go) return
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v, pad)
      },
      onComplete: () => done.current?.(),
    })
    return () => controls.stop()
  }, [to, delay, duration, pad, reduce, go])

  return <span ref={ref}>{format(to, pad)}</span>
}
