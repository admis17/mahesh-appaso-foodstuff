import { motion, useReducedMotion } from 'framer-motion'
import { company } from '../../data/company'

const stamps = [
  { label: 'TRN', value: company.trn, verified: true },
  { label: 'Trade Licence', value: company.license.number, verified: true },
  { label: 'Licensed by', value: company.license.authority },
  { label: 'Trading across', value: '6 Global Regions' },
]

function DrawnCheck({ delay, reduce }) {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" aria-hidden="true">
      <motion.circle
        cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.25"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      />
      <motion.path
        d="M4.8 8.3 7 10.4l4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: delay + 0.35, ease: 'easeOut' }}
      />
    </svg>
  )
}

/** Registration details that land like rubber stamps; registered numbers get a drawn "verified" tick. */
export default function Credentials({ delay = 1.7 }) {
  const reduce = useReducedMotion()

  return (
    <ul className="flex flex-wrap gap-3">
      {stamps.map((s, i) => {
        const d = delay + i * 0.22
        return (
          <motion.li
            key={s.label}
            initial={reduce ? false : { opacity: 0, scale: 1.6, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: d, type: 'spring', stiffness: 520, damping: 22 }}
            className="flex items-center gap-2.5 rounded-md border border-gold/35 bg-deep/40 px-3.5 py-2"
          >
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-[0.18em] text-ivory/50">{s.label}</span>
              <span className="text-sm font-semibold text-ivory">{s.value}</span>
            </span>
            {s.verified && (
              <span className="text-gold-light" title="Verified registration">
                <DrawnCheck delay={d + 0.25} reduce={reduce} />
                <span className="sr-only">Verified</span>
              </span>
            )}
          </motion.li>
        )
      })}
    </ul>
  )
}
