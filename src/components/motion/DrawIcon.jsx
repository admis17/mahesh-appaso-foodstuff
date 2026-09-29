import { useEffect, useRef } from 'react'
import { useInView, useMotionValueEvent, useMotionValue, useReducedMotion } from 'framer-motion'

const SHAPES = 'path, circle, line, polyline, polygon, rect, ellipse'

/**
 * Wraps a lucide icon and draws its strokes in.
 * - With `progress` (a 0→1 motion value): the drawing follows scroll, and rewinds on the way up.
 * - Without it: draws once when scrolled into view.
 */
export default function DrawIcon({ icon: Icon, className, delay = 0, duration = 1.1, progress }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const idle = useMotionValue(0)

  // Normalise every stroke to length 1 so a single dash offset can draw any shape.
  useEffect(() => {
    if (reduce || !ref.current) return
    ref.current.querySelectorAll(SHAPES).forEach((el) => {
      el.setAttribute('pathLength', '1')
      el.style.strokeDasharray = '1'
      el.style.strokeDashoffset = progress ? String(1 - progress.get()) : '1'
    })
  }, [reduce, progress])

  useMotionValueEvent(progress ?? idle, 'change', (p) => {
    if (reduce || !progress || !ref.current) return
    ref.current.querySelectorAll(SHAPES).forEach((el) => {
      el.style.strokeDashoffset = String(1 - p)
    })
  })

  useEffect(() => {
    if (progress || reduce || !inView || !ref.current) return
    ref.current.querySelectorAll(SHAPES).forEach((el, i) => {
      el.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.65,0,0.35,1) ${delay + i * 0.08}s`
      el.style.strokeDashoffset = '0'
    })
  }, [progress, inView, reduce, delay, duration])

  return (
    <span ref={ref} className="inline-flex">
      <Icon className={className} />
    </span>
  )
}
