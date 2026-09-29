import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ShipWheel, Send, Boxes, Search, PackageCheck, FileText, Package } from 'lucide-react'
import { services } from '../data/services'
import SectionTag from './SectionTag'
import useMediaQuery, { LG } from './motion/useMediaQuery'

const iconMap = { ShipWheel, Send, Boxes, Search, PackageCheck, FileText }

function Card({ service, index }) {
  const Icon = iconMap[service.icon] || Package
  return (
    <article className="snap-start shrink-0 w-[82vw] sm:w-[24rem] lg:w-[28rem] h-full min-h-[22rem] rounded-3xl border border-line/60 bg-ivory p-8 sm:p-10 flex flex-col">
      <div className="flex items-start justify-between mb-10">
        <span className="font-display text-6xl font-semibold text-gold/40 leading-none">{String(index + 1).padStart(2, '0')}</span>
        <span className="w-14 h-14 rounded-2xl bg-deep flex items-center justify-center">
          <Icon className="w-6 h-6 text-gold" />
        </span>
      </div>
      <h3 className="font-display text-2xl font-semibold text-ink mb-3">{service.name}</h3>
      <p className="text-slate leading-relaxed">{service.blurb}</p>
    </article>
  )
}

/**
 * Services as a horizontal rail. Desktop: the section pins and vertical scroll slides the rail
 * sideways (section height = one screen + the rail's overflow). Touch/small screens: a normal
 * swipeable, snap-scrolling row.
 */
export default function ServicesRail() {
  const lg = useMediaQuery(LG)
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [distance, setDistance] = useState(0)
  const [current, setCurrent] = useState(1)

  useLayoutEffect(() => {
    if (!lg) return
    const measure = () => setDistance(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [lg])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance], { clamp: true })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = Math.min(services.length, Math.max(1, Math.round(v * (services.length - 1)) + 1))
    setCurrent((c) => (c === n ? c : n))
  })

  return (
    <section
      ref={sectionRef}
      className="bg-sand/50 overflow-x-clip"
      style={lg ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] flex flex-col justify-center py-16 sm:py-24 lg:py-0">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 flex items-end justify-between gap-6 mb-10">
          <div>
            <SectionTag>What We Do</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
              Six Services, <span className="display-accent text-rust">One Partner</span>
            </h2>
          </div>
          <p className="hidden lg:block font-display text-2xl text-ink tabular-nums">
            {String(current).padStart(2, '0')} <span className="text-slate/60">/ {String(services.length).padStart(2, '0')}</span>
          </p>
        </div>

        <div ref={viewportRef} className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 lg:overflow-visible">
          <motion.div
            ref={trackRef}
            style={lg ? { x } : undefined}
            className="flex gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none -mx-6 px-6 lg:mx-0 lg:px-0 pb-2"
          >
            {services.map((s, i) => (
              <Card key={s.name} service={s} index={i} />
            ))}
          </motion.div>
        </div>

        {lg && (
          <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 mt-10">
            <div className="h-px bg-line relative">
              <motion.div className="absolute inset-0 origin-left bg-rust" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
