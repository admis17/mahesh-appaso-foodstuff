import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { products, productCategories } from '../data/products'
import { regions } from '../data/regions'

const stats = [
  { value: products.filter((p) => p.status === 'active').length, segments: products.filter((p) => p.status === 'active').length, label: 'Products on record' },
  { value: regions.length, segments: regions.length, label: 'Regions served' },
  { value: '100%', segments: 1, label: 'Lots checked before dispatch' },
  { value: productCategories.length, segments: productCategories.length, label: 'Commodity lines' },
]

const R = 44
const C = 2 * Math.PI * R
const GAP = 4 // px of track between segments

/** A ring split into `segments` arcs that light up one after another. */
function Ring({ stat, index, inView, reduce }) {
  const seg = C / stat.segments
  const len = stat.segments === 1 ? C : seg - GAP

  return (
    <figure className="flex flex-col items-center text-center">
      <div className="relative w-36 h-36 sm:w-40 sm:h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {Array.from({ length: stat.segments }, (_, i) => (
            <g key={i}>
              <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(251,248,241,0.1)" strokeWidth="6" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-i * seg} />
              <motion.circle
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="6"
                strokeLinecap={stat.segments === 1 ? 'round' : 'butt'}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-i * seg}
                initial={reduce ? false : { opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ delay: 0.2 + index * 0.25 + i * (0.9 / stat.segments), duration: 0.25 }}
              />
            </g>
          ))}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-3xl sm:text-4xl font-semibold text-gold-light">
          {stat.value}
        </span>
      </div>
      <figcaption className="mt-4 text-sm text-ivory/65 max-w-[10rem]">{stat.label}</figcaption>
    </figure>
  )
}

/** Markets stats as segmented rings — each segment is one product, region or line, lighting in turn. */
export default function RingStats() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-deep text-ivory">
      <div ref={ref} className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 sm:py-20 grid grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((s, i) => (
          <Ring key={s.label} stat={s} index={i} inView={inView || reduce} reduce={reduce} />
        ))}
      </div>
    </section>
  )
}
