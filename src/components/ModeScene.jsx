import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/*
 * Small looping scene for each way goods move (Markets page). Loops only while on screen.
 *   sea     – a container ship rocks as the swell rolls under it
 *   air     – a plane crosses on a climbing arc, trailing dashes
 *   customs – a stack of documents fans out and gathers back
 */
export default function ModeScene({ kind }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const live = useInView(ref, { margin: '-40px' }) && !reduce
  const loop = (duration, extra = {}) => ({ duration, repeat: Infinity, ease: 'easeInOut', ...extra })

  return (
    <div ref={ref} className="h-20 mb-6 rounded-xl bg-deep overflow-hidden relative" aria-hidden="true">
      <svg viewBox="0 0 200 80" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        {kind === 'sea' && (
          <>
            <motion.path
              d="M-60 60 q 15 -8 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 V80 H-60 Z"
              fill="rgba(217,164,65,0.18)"
              animate={live ? { x: [0, 60] } : undefined}
              transition={loop(3, { ease: 'linear' })}
            />
            <motion.g style={{ transformOrigin: '100px 52px' }} animate={live ? { rotate: [-3, 3, -3], y: [0, -2, 0] } : undefined} transition={loop(3)}>
              <path d="M70 48 h62 l-8 12 h-48 z" fill="var(--color-gold)" />
              <rect x="80" y="36" width="12" height="12" fill="var(--color-rust)" />
              <rect x="93" y="36" width="12" height="12" fill="var(--color-gold-light)" />
              <rect x="106" y="36" width="12" height="12" fill="var(--color-rust)" />
              <rect x="93" y="24" width="12" height="12" fill="var(--color-gold-light)" opacity="0.8" />
              <rect x="120" y="30" width="6" height="18" fill="var(--color-ivory)" opacity="0.8" />
            </motion.g>
          </>
        )}

        {kind === 'air' && (
          <>
            <path d="M-10 70 Q 100 -10 210 40" fill="none" stroke="rgba(233,197,120,0.35)" strokeWidth="1" strokeDasharray="3 4" />
            <motion.g
              animate={live ? { offsetDistance: ['0%', '100%'] } : undefined}
              transition={loop(4, { ease: 'linear' })}
              style={{ offsetPath: "path('M-10 70 Q 100 -10 210 40')", offsetRotate: 'auto', offsetDistance: '45%' }}
            >
              <path d="M-8 0 L8 0 M-2 0 L-6 -7 M-2 0 L-6 7 M6 0 L3 -3 M6 0 L3 3" stroke="var(--color-gold-light)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </motion.g>
          </>
        )}

        {kind === 'customs' &&
          [0, 1, 2].map((i) => (
            <motion.g
              key={i}
              style={{ transformOrigin: '100px 72px' }}
              animate={live ? { rotate: [0, (i - 1) * 16, (i - 1) * 16, 0] } : { rotate: (i - 1) * 8 }}
              transition={loop(3.2, { times: [0, 0.3, 0.7, 1] })}
            >
              <rect x="82" y="16" width="36" height="48" rx="3" fill={i === 1 ? 'var(--color-ivory)' : 'rgba(251,248,241,0.55)'} />
              <rect x="88" y="24" width="24" height="2.5" rx="1" fill="var(--color-deep)" opacity="0.5" />
              <rect x="88" y="31" width="18" height="2.5" rx="1" fill="var(--color-deep)" opacity="0.35" />
              <rect x="88" y="38" width="22" height="2.5" rx="1" fill="var(--color-deep)" opacity="0.35" />
              {i === 1 && <circle cx="108" cy="54" r="5" fill="none" stroke="var(--color-rust)" strokeWidth="1.5" />}
            </motion.g>
          ))}
      </svg>
    </div>
  )
}
