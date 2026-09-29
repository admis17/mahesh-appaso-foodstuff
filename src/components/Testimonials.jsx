import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Quote } from 'lucide-react'
import { testimonials } from '../data/testimonials'
import SectionTag from './SectionTag'

const n = testimonials.length

const heading = (
  <div className="max-w-2xl mb-10">
    <SectionTag>Trade Partners</SectionTag>
    <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
      What Buyers <span className="display-accent text-rust">Say</span>
    </h2>
  </div>
)

function QuoteBody({ t }) {
  return (
    <>
      <Quote className="w-10 h-10 text-gold mb-6" />
      <blockquote className="font-display text-xl sm:text-2xl leading-snug text-ink mb-8">&ldquo;{t.quote}&rdquo;</blockquote>
      <p className="font-display font-semibold text-ink">{t.name}</p>
      <p className="text-xs text-slate mt-0.5">{t.location}</p>
    </>
  )
}

/** Progress dot: fills as scroll moves through its testimonial; clicking scrolls there. */
function Dot({ index, progress, active, onSelect }) {
  const fill = useTransform(progress, (p) => Math.min(1, Math.max(0, p * n - index)))
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Show testimonial ${index + 1} of ${n}`}
      aria-current={active}
      className={`relative h-1.5 rounded-full overflow-hidden bg-deep/15 hover:bg-deep/30 transition-all duration-300 ${active ? 'w-12' : 'w-6'}`}
    >
      <motion.span className="absolute inset-0 origin-left bg-gold" style={{ scaleX: fill }} />
    </button>
  )
}

/**
 * Buyer quotes, driven by scroll: the section pins while the visitor scrolls through one quote
 * per stretch of scroll, and steps back through them when scrolling up.
 */
export default function Testimonials() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const current = useRef(0)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(n - 1, Math.floor(p * n))
    if (next === current.current) return
    setDir(next > current.current ? 1 : -1)
    current.current = next
    setIndex(next)
  })

  // The admin can unpublish every quote; the section then simply doesn't render.
  if (!n) return null

  const select = (i) => {
    const el = ref.current
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + travel * ((i + 0.5) / n), behavior: 'smooth' })
  }

  // Reduced motion: no pinning — all quotes laid out plainly.
  if (reduce) {
    return (
      <section className="bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
          {heading}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <figure key={t.name} className="bg-sand/50 rounded-2xl p-8 border border-line/60">
                <QuoteBody t={t} />
              </figure>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const t = testimonials[index]

  return (
    // One screen of scroll per quote after the first; the inner block stays pinned meanwhile.
    <section ref={ref} className="bg-ivory relative" style={{ height: `${100 + (n - 1) * 70}vh` }}>
      <div className="sticky top-16 h-[calc(100vh-4rem)] flex items-center">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10">
          {heading}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Buyer testimonials"
            className="relative max-w-4xl mx-auto rounded-3xl bg-sand/50 border border-line/60 px-7 py-10 sm:px-14 sm:py-14"
          >
            {/* Fixed-height stage: all quotes stacked invisibly set the height, so nothing jumps. */}
            <div className="grid">
              {testimonials.map((q) => (
                <div key={q.name} aria-hidden="true" className="invisible [grid-area:1/1]">
                  <QuoteBody t={q} />
                </div>
              ))}
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.figure
                  key={t.name}
                  custom={dir}
                  className="[grid-area:1/1]"
                  aria-live="polite"
                  variants={{
                    enter: (d) => ({ opacity: 0, y: 40 * d }),
                    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                    leave: (d) => ({ opacity: 0, y: -40 * d, transition: { duration: 0.25 } }),
                  }}
                  initial="enter"
                  animate="show"
                  exit="leave"
                >
                  <QuoteBody t={t} />
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center gap-2.5">
              {testimonials.map((q, i) => (
                <Dot key={q.name} index={i} progress={scrollYProgress} active={i === index} onSelect={select} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
