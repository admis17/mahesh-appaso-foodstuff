import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Seeded RNG so the pattern looks the same on every visit.
function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeGrains(count, minLeft, dim) {
  const rand = mulberry32(1632113)
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    kind: rand() < 0.3 ? 'chickpea' : 'rice',
    left: minLeft + rand() * (100 - minLeft),
    duration: 9 + rand() * 8,
    delay: rand() * -17, // negative: already mid-fall on first paint
    spin: (rand() < 0.5 ? -1 : 1) * (180 + rand() * 360),
    sway: (rand() - 0.5) * 60,
    opacity: (0.25 + rand() * 0.3) * dim,
  }))
}

/**
 * Rice grains and chickpeas drifting down and out of the bottom of the parent. Decorative only.
 * `minLeft` keeps them clear of left-aligned copy; `dim` scales their opacity.
 */
export default function FallingGrains({ className = '', count = 28, minLeft = 30, dim = 1 }) {
  const reduce = useReducedMotion()
  const grains = useMemo(() => makeGrains(count, minLeft, dim), [count, minLeft, dim])
  if (reduce) return null

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {grains.map((g) => (
        <motion.span
          key={g.id}
          className={
            g.kind === 'rice'
              ? 'absolute -top-6 w-[5px] h-[15px] rounded-full bg-ivory'
              : 'absolute -top-6 w-[11px] h-[11px] rounded-full bg-gold'
          }
          style={{ left: `${g.left}%`, opacity: g.opacity }}
          animate={{ y: ['0vh', '110vh'], x: [0, g.sway, 0], rotate: [0, g.spin] }}
          transition={{ duration: g.duration, delay: g.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}
