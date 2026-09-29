import { useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { Container } from 'lucide-react'
import { process } from '../data/regions'
import SectionTag from './SectionTag'
import useMediaQuery, { LG } from './motion/useMediaQuery'

const last = process.length - 1

function Step({ step, index, lg, progressIndex }) {
  const ref = useRef(null)
  // Stacked layout: a step lights up as its top crosses the same line the progress fill tracks.
  const crossed = useInView(ref, { margin: '0px 0px -45% 0px' })
  const active = lg ? progressIndex >= index : crossed

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: lg ? index * 0.1 : 0 }}
      className="relative pl-12 lg:pl-0 lg:pt-10"
    >
      {/* Marker on the track */}
      <span
        className={`absolute left-[9px] top-2 lg:left-0 lg:top-0 w-3.5 h-3.5 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 rounded-full border-2 transition-colors duration-500 ${
          active ? 'bg-gold border-gold shadow-[0_0_0_6px_rgba(217,164,65,0.18)]' : 'bg-deep border-ivory/30'
        }`}
      />
      <span
        className={`font-display text-4xl sm:text-5xl font-semibold block mb-4 transition-colors duration-500 ${
          active ? 'text-gold' : 'text-ivory/15'
        }`}
      >
        {step.step}
      </span>
      <h3 className="font-display text-lg font-semibold text-gold-light mb-2.5">{step.title}</h3>
      <p className="text-sm text-ivory/65 leading-relaxed">{step.blurb}</p>
    </motion.div>
  )
}

export default function ProcessSteps() {
  const listRef = useRef(null)
  const lg = useMediaQuery(LG)
  const sectionRef = useRef(null)

  // Desktop: the section pins while its extra height scrolls past, and that scroll drives the line.
  // The first and last slices are dwell time so step 01 and step 05 each get a beat on screen.
  const { scrollYProgress: pinned } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const pinnedProgress = useTransform(pinned, [0.08, 0.85], [0, 1], { clamp: true })
  // Stacked (mobile): no pinning — the line tracks the list as it passes mid-screen.
  const { scrollYProgress: stacked } = useScroll({ target: listRef, offset: ['start 55%', 'end 55%'] })

  const scrollYProgress = lg ? pinnedProgress : stacked
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  const [progressIndex, setProgressIndex] = useState(-1)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = v <= 0.001 ? -1 : Math.floor(v * last + 0.02)
    setProgressIndex((cur) => (cur === idx ? cur : idx))
  })

  const along = useTransform(progress, (v) => `${v * 100}%`)

  return (
    // overflow-x-clip (not overflow-hidden) so the sticky child still pins to the viewport.
    <section ref={sectionRef} className="bg-deep text-ivory overflow-x-clip lg:h-[280vh]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24 lg:py-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:flex lg:flex-col lg:justify-center">
        <div className="max-w-2xl mb-14">
          <SectionTag light>How It Works</SectionTag>
          <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] mt-5">
            From Mill to <span className="display-accent text-gold-light">Your Doorstep</span>
          </h2>
        </div>

        <div ref={listRef} className="relative grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-6">
          {/* Track: vertical on stacked layouts, horizontal across the desktop row
              (ends at the last column's start, where its marker sits). */}
          <div
            aria-hidden="true"
            className="absolute left-[9px] top-2 bottom-2 w-px lg:top-0 lg:bottom-auto lg:left-0 lg:right-[calc((100%-6rem)/5)] lg:w-auto lg:h-px bg-ivory/15"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-gold to-gold-light origin-top lg:origin-left"
              style={lg ? { scaleX: progress } : { scaleY: progress }}
            />
            <motion.span
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 lg:-translate-y-[calc(100%+8px)] text-gold-light"
              style={lg ? { left: along } : { top: along }}
            >
              <span className="flex w-7 h-7 lg:w-auto lg:h-auto items-center justify-center rounded-full bg-deep lg:bg-transparent">
                <Container className="w-5 h-5" strokeWidth={1.75} />
              </span>
            </motion.span>
          </div>

          {process.map((step, i) => (
            <Step key={step.step} step={step} index={i} lg={lg} progressIndex={progressIndex} />
          ))}
        </div>
      </div>
    </section>
  )
}
