import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useScrub, useSlice } from './motion/useScrub'

const headline = 'Every Grade Graded and Packed to Export Standard'
const words = headline.split(' ')

/** One headline word: fades and rises over its own slice of the banner's scroll. */
function Word({ word, index, progress }) {
  const start = (index / words.length) * 0.6
  const t = useSlice(progress, [start, start + 0.4])
  const opacity = useTransform(t, [0, 1], [0, 1])
  const y = useTransform(t, [0, 1], ['0.6em', '0em'])
  const blur = useTransform(t, (v) => `blur(${(1 - v) * 6}px)`)
  return (
    <motion.span aria-hidden="true" className="inline-block mr-[0.25em]" style={{ opacity, y, filter: blur }}>
      {word}
    </motion.span>
  )
}

/**
 * Full-bleed rice photo, all driven by scroll: the photo zooms out as it passes, a sortex-style
 * scan line sweeps across in step with the scroll, and the headline builds word by word.
 */
export default function GradedBanner() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1])
  const scanX = useTransform(scrollYProgress, [0.15, 0.85], ['-10vw', '110vw'])
  const build = useScrub(ref, ['start 75%', 'start 15%'])
  const eyebrow = useSlice(build, [0, 0.25])

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="h-[50vh] sm:h-[60vh] relative">
        <motion.img
          src="/mill-to-market.webp"
          alt="MA Foods Stuff premium rice and pulses"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ scale }}
          loading="lazy"
        />

        {/* Scan line — a nod to optical (sortex) grading passing over the grain. */}
        {!reduce && (
          <motion.div aria-hidden="true" className="absolute inset-y-0 left-0 w-24 -ml-24 pointer-events-none" style={{ x: scanX }}>
            <div className="absolute inset-y-0 right-0 w-px bg-gold-light/80 shadow-[0_0_18px_4px_rgba(233,197,120,0.55)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gold-light/15" />
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-10 sm:pb-14 w-full">
            <motion.p className="eyebrow text-gold-light mb-3" style={{ opacity: eyebrow }}>
              From Mill to Market
            </motion.p>
            <h2 className="display-heading text-[clamp(1.7rem,3.2vw,2.6rem)] text-ivory max-w-xl" aria-label={headline}>
              {words.map((w, i) => (
                <Word key={i} word={w} index={i} progress={build} />
              ))}
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}
