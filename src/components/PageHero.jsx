import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion'
import SectionTag from './SectionTag'
import useMediaQuery, { FINE_POINTER } from './motion/useMediaQuery'

/*
 * Inner-page banner. Each page picks its own entrance so no two pages open the same way:
 *   stencil  – title spray-painted in through a moving mask (Products)
 *   focus    – photo pulls from blurred to sharp, like inspecting grain (category pages)
 *   loupe    – magnifier follows the pointer over the photo (product detail)
 *   tracking – title letter-spacing collapses together (About)
 *   fill     – outlined title fills with gold from the bottom (Services)
 *   typing   – chat "…" bubble, then the headline arrives as the reply (Contact)
 * `aside` renders beside the copy (Markets uses it for the globe).
 */

const ease = [0.22, 1, 0.36, 1]
// Tween settings live at module level so their identity is stable across renders.
const FILL = { duration: 1.8, delay: 0.3, ease: [0.65, 0, 0.35, 1] }
const SPRAY = { duration: 1.6, delay: 0.2, ease: 'easeInOut' }

/**
 * A number that tweens from → to once on mount (instantly for reduced motion). Gradient and mask
 * sweeps are built from it with useMotionTemplate — Framer doesn't interpolate CSS custom properties.
 */
function useTween(from, to, opts, reduce) {
  const v = useMotionValue(reduce ? to : from)
  useEffect(() => {
    if (reduce) return v.set(to)
    const controls = animate(v, to, opts)
    return () => controls.stop()
  }, [v, to, opts, reduce])
  return v
}

function Title({ title, accent, effect, reduce }) {
  const [before, after] = accent ? title.split(accent) : [title, '']
  const base = 'display-heading text-[clamp(2.2rem,5.5vw,4rem)] mt-6 mb-6 max-w-3xl text-balance'

  const fill = useTween(0, 100, FILL, reduce || effect !== 'fill')
  const fillImage = useMotionTemplate`linear-gradient(to top, var(--color-gold-light) ${fill}%, transparent ${fill}%)`
  const spray = useTween(-10, 115, SPRAY, reduce || effect !== 'stencil')
  const sprayMask = useMotionTemplate`linear-gradient(90deg, #000 calc(${spray}% - 8%), transparent calc(${spray}% + 8%))`

  if (effect === 'fill') {
    return (
      <motion.h1
        className={`${base} text-transparent [-webkit-text-stroke:1px_rgba(251,248,241,0.55)] bg-clip-text`}
        style={{ backgroundImage: fillImage }}
      >
        {before}
        {accent && <span className="display-accent">{accent}</span>}
        {after}
      </motion.h1>
    )
  }

  if (effect === 'stencil') {
    return (
      <div className="relative">
        <motion.h1 className={base} style={{ WebkitMaskImage: sprayMask, maskImage: sprayMask }}>
          {before}
          {accent && <span className="display-accent text-gold-light">{accent}</span>}
          {after}
        </motion.h1>
        {/* Overspray mist riding the spray front */}
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-40 h-40 -ml-20 rounded-full bg-gold-light/25 blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ left: ['-10%', '105%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.6, delay: 0.2, ease: 'easeInOut' }}
          />
        )}
      </div>
    )
  }

  if (effect === 'tracking') {
    return (
      <motion.h1
        className={base}
        initial={reduce ? false : { letterSpacing: '0.35em', opacity: 0, filter: 'blur(6px)' }}
        animate={{ letterSpacing: '-0.015em', opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease }}
      >
        {before}
        {accent && <span className="display-accent text-gold-light">{accent}</span>}
        {after}
      </motion.h1>
    )
  }

  return (
    <h1 className={base}>
      {before}
      {accent && <span className="display-accent text-gold-light">{accent}</span>}
      {after}
    </h1>
  )
}

function TypingTitle(props) {
  const { reduce } = props
  const [ready, setReady] = useState(reduce)

  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setReady(true), 1400)
    return () => clearTimeout(t)
  }, [reduce])

  return (
    <div className="relative">
      <AnimatePresence>
        {!ready && (
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-6 inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-ivory/10 border border-ivory/15 px-5 py-4"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-gold-light"
                animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease }}
      >
        <Title {...props} effect="plain" />
      </motion.div>
    </div>
  )
}

/** Magnifier over the hero photo — fine pointers only. */
function Loupe({ image, sectionRef }) {
  const [pos, setPos] = useState(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const R = 90
  const ZOOM = 2.4

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
    }
    const leave = () => setPos(null)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [sectionRef])

  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute z-20 rounded-full overflow-hidden ring-2 ring-gold-light/80 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          style={{ width: R * 2, height: R * 2, left: pos.x - R, top: pos.y - R }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute origin-top-left"
            style={{ width: size.w, height: size.h, transform: `translate(${R - pos.x * ZOOM}px, ${R - pos.y * ZOOM}px) scale(${ZOOM})` }}
          >
            <img src={image} alt="" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function PageHero({ tag, title, accent, body, image, effect = 'plain', aside }) {
  const reduce = useReducedMotion()
  const fine = useMediaQuery(FINE_POINTER)
  const sectionRef = useRef(null)
  const titleProps = { title, accent, effect, reduce }

  return (
    <section ref={sectionRef} className={`relative bg-deep text-ivory overflow-hidden ${effect === 'loupe' && fine ? 'cursor-none' : ''}`}>
      <div className="absolute inset-0">
        <motion.img
          src={image}
          alt=""
          className="w-full h-full object-cover opacity-30"
          initial={effect === 'focus' && !reduce ? { filter: 'blur(18px)', scale: 1.12 } : false}
          animate={effect === 'focus' ? { filter: 'blur(0px)', scale: 1 } : undefined}
          transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/80 to-deep/60" />
      </div>

      {effect === 'loupe' && fine && !reduce && <Loupe image={image} sectionRef={sectionRef} />}

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-28 sm:pt-36 pb-16 sm:pb-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-10 items-center">
        <motion.div
          initial={reduce || effect !== 'plain' ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionTag light>{tag}</SectionTag>
          {effect === 'typing' ? <TypingTitle {...titleProps} /> : <Title {...titleProps} />}
          {body && <p className="text-ivory/75 text-base sm:text-lg max-w-xl leading-relaxed">{body}</p>}
          {effect === 'loupe' && fine && !reduce && (
            <p className="eyebrow text-gold-light/70 mt-6">Hover the photo to inspect</p>
          )}
        </motion.div>
        {aside}
      </div>
    </section>
  )
}
