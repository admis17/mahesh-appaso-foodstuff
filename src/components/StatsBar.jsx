import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import ScrubNumber from './motion/ScrubNumber'
import { useScrub, useSlice } from './motion/useScrub'
import { products } from '../data/products'

// `count` values climb with scroll; `value` is shown as-is.
const stats = [
  { count: products.filter((p) => p.status === 'active').length, label: 'Products — Rice & Pulses' },
  { count: 6, label: 'Regions Served Worldwide' },
  { count: 100, suffix: '%', label: 'Lots Checked Before Dispatch' },
  { value: 'Dubai', label: 'Home Base, UAE' },
]

/** One stat: rises, counts and underlines across its own slice of the bar's scroll. */
function Stat({ stat, index, progress }) {
  const start = index * 0.12
  const t = useSlice(progress, [start, start + 0.6])
  const opacity = useTransform(t, [0, 0.3], [0, 1])
  const y = useTransform(t, [0, 0.5], [28, 0])
  const underline = useSlice(t, [0.55, 1])

  return (
    <motion.div style={{ opacity, y }} className="text-center sm:text-left">
      <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-gold-light mb-2 tabular-nums">
        {stat.count !== undefined ? (
          <>
            <ScrubNumber progress={t} to={stat.count} />
            {stat.suffix}
          </>
        ) : (
          stat.value
        )}
      </p>
      <motion.span aria-hidden="true" style={{ scaleX: underline }} className="block h-px w-12 mb-3 mx-auto sm:mx-0 origin-left bg-gold" />
      <p className="text-xs sm:text-sm text-ivory/65 leading-snug">{stat.label}</p>
    </motion.div>
  )
}

export default function StatsBar() {
  const ref = useRef(null)
  const progress = useScrub(ref, ['start 95%', 'start 35%'])

  return (
    <section ref={ref} className="bg-deep text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {stats.map((s, i) => (
            <Stat key={s.label} stat={s} index={i} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  )
}
