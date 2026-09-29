import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { process } from '../data/regions'
import SectionTag from './SectionTag'

const n = process.length

/** One step card: pins below the header, then shrinks and dims as later cards stack over it. */
function StackCard({ step, index, progress }) {
  const start = index / n
  const scale = useTransform(progress, [start, 1], [1, 1 - (n - 1 - index) * 0.04])
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / n)], [0, index === n - 1 ? 0 : 0.35])

  return (
    <div className="sticky h-[55vh] min-h-[20rem] flex items-start" style={{ top: `calc(6rem + ${index * 1.75}rem)` }}>
      <motion.article
        style={{ scale, transformOrigin: 'top center' }}
        className="relative w-full rounded-3xl border border-ivory/15 bg-deep-light p-8 sm:p-12 overflow-hidden shadow-[0_-12px_40px_rgba(0,0,0,0.25)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-start">
          <span className="font-display text-7xl sm:text-8xl font-semibold text-gold leading-none">{step.step}</span>
          <div>
            <p className="eyebrow text-ivory/50 mb-3">Step {index + 1} of {n}</p>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ivory mb-4">{step.title}</h3>
            <p className="text-ivory/70 text-base sm:text-lg leading-relaxed max-w-2xl">{step.blurb}</p>
          </div>
        </div>
        <motion.div aria-hidden="true" className="absolute inset-0 bg-deep pointer-events-none" style={{ opacity: dim }} />
      </motion.article>
    </div>
  )
}

/** The process as cards that stack on top of each other while you scroll through the section. */
export default function ProcessStack() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section className="bg-deep text-ivory">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 pt-16 sm:pt-24">
        <SectionTag light>How It Works</SectionTag>
        <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] mt-5 mb-10">
          Five Steps to <span className="display-accent text-gold-light">Your Door</span>
        </h2>
        <div ref={ref} className="pb-16 sm:pb-24">
          {process.map((step, i) => (
            <StackCard key={step.step} step={step} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}
