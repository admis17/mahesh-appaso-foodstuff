import { forwardRef, useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { ENTER, useScrub, useSlice } from './useScrub'

const lerp = (a, b) => (t) => a + (b - a) * t

/**
 * Wrapper whose opacity / x / y / scale / rotate / rotateX move from `from` to their resting
 * values as scroll progresses. Pass `progress` to share one section's progress (with `range` to
 * stagger), or let it track its own position with `offset`.
 */
const Scrub = forwardRef(function Scrub(
  { as = 'div', from = { opacity: 0, y: 48 }, range = [0, 1], offset = ENTER, progress, style, children, ...rest },
  forwarded,
) {
  const localRef = useRef(null)
  const own = useScrub(localRef, offset)
  const t = useSlice(progress ?? own, range)

  const opacity = useTransform(t, lerp(from.opacity ?? 1, 1))
  const x = useTransform(t, lerp(from.x ?? 0, 0))
  const y = useTransform(t, lerp(from.y ?? 0, 0))
  const scale = useTransform(t, lerp(from.scale ?? 1, 1))
  const rotate = useTransform(t, lerp(from.rotate ?? 0, 0))
  const rotateX = useTransform(t, lerp(from.rotateX ?? 0, 0))

  const Tag = motion[as]
  const setRef = (node) => {
    localRef.current = node
    if (typeof forwarded === 'function') forwarded(node)
    else if (forwarded) forwarded.current = node
  }

  return (
    <Tag ref={setRef} style={{ opacity, x, y, scale, rotate, rotateX, ...style }} {...rest}>
      {children}
    </Tag>
  )
})

export default Scrub
