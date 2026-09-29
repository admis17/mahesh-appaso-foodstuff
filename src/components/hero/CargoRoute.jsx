import { motion, useReducedMotion } from 'framer-motion'
import { Container } from 'lucide-react'

const stops = ['India', 'Dubai', 'Destination']

/** India → Dubai → Destination: the line draws, then a container travels it once. */
export default function CargoRoute({ delay = 1.2 }) {
  const reduce = useReducedMotion()
  const travel = 3.2

  return (
    <div role="img" aria-label="Trade route: India to Dubai to destination" className="relative pt-9 pb-7">
      {/* track */}
      <div className="relative h-px bg-ivory/15">
        <motion.div
          className="absolute inset-0 origin-left bg-gradient-to-r from-gold via-gold-light to-gold"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>

      {/* stops */}
      {stops.map((label, i) => {
        const at = i / (stops.length - 1)
        return (
          <div key={label} className="absolute top-9 -translate-x-1/2 -translate-y-1/2" style={{ left: `${at * 100}%` }}>
            <motion.span
              className="relative block w-2.5 h-2.5 rounded-full bg-gold ring-4 ring-deep"
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.9 * at, type: 'spring', stiffness: 400, damping: 18 }}
            />
            {!reduce && (
              <motion.span
                className="absolute inset-0 rounded-full border border-gold-light"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 3], opacity: [0.9, 0] }}
                transition={{ duration: 0.9, delay: delay + 0.9 + travel * at, ease: 'easeOut' }}
              />
            )}
            <span
              className={`absolute top-4 eyebrow text-[10px] text-ivory/70 whitespace-nowrap ${
                i === 0 ? 'left-0' : i === stops.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'
              }`}
            >
              {label}
            </span>
          </div>
        )
      })}

      {/* container */}
      <motion.div
        aria-hidden="true"
        className="absolute top-9 -translate-y-[calc(100%+6px)]"
        initial={reduce ? false : { left: '0%', opacity: 0 }}
        animate={{ left: reduce ? '100%' : ['0%', '50%', '50%', '100%'], opacity: 1 }}
        transition={{
          left: { duration: travel, delay: delay + 0.9, times: [0, 0.42, 0.58, 1], ease: 'easeInOut' },
          opacity: { duration: 0.3, delay: delay + 0.8 },
        }}
      >
        <span className="block -translate-x-1/2">
          <Container className="w-5 h-5 text-gold-light" strokeWidth={1.75} />
        </span>
      </motion.div>
    </div>
  )
}
