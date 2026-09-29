import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import Button from './Button'
import SectionTag from './SectionTag'
import FallingGrains from './motion/FallingGrains'
import { useScrub } from './motion/useScrub'
import Magnetic from './motion/Magnetic'

/*
 * Closing call-to-action panel. `effect` gives each page its own treatment:
 *   glow      – rises with scroll; drifting gold glow, faint falling grains, one button pulse (Home)
 *   beam      – a light runs continuously around the panel's border (Products)
 *   magnetic  – buttons lean toward the pointer (category pages)
 *   signature – a handwritten "Mahesh" signs itself under the heading (About)
 *   lines     – heading rises line by line from behind a mask (Services)
 *   compass   – a compass needle spins and settles on the quote button (Markets)
 */

const PULSE = ['0 0 0 0 rgba(233,197,120,0)', '0 0 0 10px rgba(233,197,120,0.4)', '0 0 0 24px rgba(233,197,120,0)']

function Signature({ inView, reduce }) {
  return (
    <svg viewBox="0 0 320 90" className="mx-auto -mt-2 mb-6 w-56 sm:w-64 h-auto" aria-hidden="true">
      <motion.text
        x="160"
        y="62"
        textAnchor="middle"
        fontFamily="'Great Vibes', cursive"
        fontSize="64"
        fill="var(--color-gold-light)"
        stroke="var(--color-gold-light)"
        strokeWidth="0.9"
        strokeDasharray="600"
        initial={reduce ? false : { strokeDashoffset: 600, fillOpacity: 0 }}
        animate={inView ? { strokeDashoffset: 0, fillOpacity: 1 } : undefined}
        transition={{ strokeDashoffset: { duration: 2.4, ease: 'easeInOut', delay: 0.3 }, fillOpacity: { duration: 0.8, delay: 2.2 } }}
      >
        Mahesh
      </motion.text>
      <motion.path
        d="M70 78 C 130 70, 200 72, 262 66"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.7, delay: 2.5, ease: 'easeOut' }}
      />
    </svg>
  )
}

function Compass({ inView, reduce }) {
  return (
    <div className="mx-auto mb-6 w-16 h-16 rounded-full border border-gold/40 bg-deep-light/60 relative" aria-hidden="true">
      {['N', 'E', 'S', 'W'].map((d, i) => (
        <span
          key={d}
          className="absolute text-[8px] font-bold text-ivory/50"
          style={{ left: '50%', top: '50%', transform: `rotate(${i * 90}deg) translateY(-24px) rotate(${-i * 90}deg) translate(-50%, -50%)` }}
        >
          {d}
        </span>
      ))}
      {/* Rotate an HTML wrapper: a transform on the outer <svg> itself doesn't apply reliably. */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ rotate: reduce ? 150 : inView ? [0, 540, 470, 520, 505, 510] : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 2.6, ease: 'easeOut', times: [0, 0.45, 0.65, 0.8, 0.9, 1] }}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <path d="M32 12 L36 32 L32 36 L28 32 Z" fill="var(--color-gold-light)" />
          <path d="M32 52 L36 32 L32 28 L28 32 Z" fill="var(--color-ivory)" opacity="0.35" />
          <circle cx="32" cy="32" r="2.5" fill="var(--color-deep)" stroke="var(--color-gold)" />
        </svg>
      </motion.div>
    </div>
  )
}

export default function CTASection({
  tag = 'Start Your Order',
  title = 'Ready to Source With Confidence?',
  accent = 'Confidence?',
  body = "Whether you're a buyer, distributor or importer — tell us what you need and we'll get back with a quote.",
  primary = { to: '/contact', label: 'Request a Quote' },
  secondary = { to: '/products', label: 'View Products' },
  effect = 'glow',
}) {
  const [before] = title.split(accent)
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const scrub = useScrub(ref, ['start 100%', 'start 45%'])
  const glowOpacity = useTransform(scrub, [0, 0.5], [0, 1])
  const glowY = useTransform(scrub, [0, 1], [90, 0])
  const glowScale = useTransform(scrub, [0, 1], [0.86, 1])

  // Beam: the conic gradient's start angle turns forever. Framer doesn't tween CSS custom
  // properties, so the angle is a motion value fed into the gradient string.
  const angle = useMotionValue(0)
  const beamImage = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0deg 250deg, var(--color-gold-light) 300deg, transparent 350deg)`
  useEffect(() => {
    if (effect !== 'beam' || reduce) return
    const controls = animate(angle, 360, { duration: 5, repeat: Infinity, ease: 'linear' })
    return () => controls.stop()
  }, [effect, reduce, angle])

  const heading =
    effect === 'lines' ? (
      <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ivory mt-6 mb-6 text-balance">
        {[before, accent].map((part, i) => (
          <span key={i} className="block overflow-hidden pb-[0.12em]">
            {/* CSS transition: each line rises from below its own clipping edge. */}
            <span
              className={`block transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                inView || reduce ? 'translate-y-0' : 'translate-y-[110%]'
              } ${i === 1 ? 'display-accent text-gold-light' : ''}`}
              style={{ transitionDelay: `${200 + i * 180}ms` }}
            >
              {part}
            </span>
          </span>
        ))}
      </h2>
    ) : (
      <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ivory mt-6 mb-6 text-balance">
        {before}
        <span className="display-accent text-gold-light">{accent}</span>
      </h2>
    )

  // Home ('glow'): the panel grows and rises with scroll, rewinding on the way back up.
  // Other pages keep a simple one-off entrance so their own effect stays the focus.
  const entrance =
    effect === 'glow'
      ? { style: { opacity: glowOpacity, y: glowY, scale: glowScale } }
      : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.6 } }

  const panel = (
    <motion.div
      ref={ref}
      {...entrance}
      className="bg-deep rounded-3xl py-14 sm:py-20 px-8 sm:px-16 text-center relative overflow-hidden isolate"
    >
      {effect === 'glow' && !reduce && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute -z-10 w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.28),transparent_65%)] -top-64 -left-40"
            animate={{ x: [0, 260, 120, 0], y: [0, 120, 260, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -z-10 w-[28rem] h-[28rem] rounded-full bg-[radial-gradient(circle,rgba(193,98,45,0.22),transparent_65%)] -bottom-56 -right-32"
            animate={{ x: [0, -220, -80, 0], y: [0, -140, -40, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}
      <div className="absolute inset-0 -z-10 bg-dot-grid opacity-10 pointer-events-none" />
      {effect === 'glow' && <FallingGrains count={14} minLeft={0} dim={0.45} className="-z-10" />}

      <div className="relative">
        <SectionTag light className="justify-center">{tag}</SectionTag>
        {effect === 'compass' && <div className="mt-6"><Compass inView={inView} reduce={reduce} /></div>}
        {heading}
        {effect === 'signature' && <Signature inView={inView} reduce={reduce} />}
        <p className="text-ivory/70 text-base sm:text-lg mb-9 max-w-xl mx-auto leading-relaxed">{body}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Magnetic enabled={effect === 'magnetic'}>
            {effect === 'glow' ? (
              // One pulse on the main action as the panel arrives.
              <motion.span
                className="inline-flex rounded-full"
                initial={{ boxShadow: PULSE[0] }}
                animate={inView && !reduce ? { boxShadow: PULSE } : undefined}
                transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
              >
                <Button to={primary.to} variant="gold" size="lg">{primary.label}</Button>
              </motion.span>
            ) : (
              <Button to={primary.to} variant="gold" size="lg">{primary.label}</Button>
            )}
          </Magnetic>
          <Magnetic enabled={effect === 'magnetic'}>
            <Button to={secondary.to} variant="outline" size="lg">{secondary.label}</Button>
          </Magnetic>
        </div>
      </div>
    </motion.div>
  )

  return (
    <section className="bg-sand/50">
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
        {effect === 'beam' ? (
          // A 2px frame whose conic gradient rotates, so a bright segment travels the border.
          <motion.div className="relative rounded-[26px] p-[2px]" style={{ backgroundImage: beamImage }}>
            {panel}
          </motion.div>
        ) : (
          panel
        )}
      </div>
    </section>
  )
}
