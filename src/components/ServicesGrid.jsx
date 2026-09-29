import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ShipWheel, Send, Boxes, Search, PackageCheck, FileText, Package } from 'lucide-react'
import { services } from '../data/services'
import SectionTag from './SectionTag'
import Scrub from './motion/Scrub'

const iconMap = { ShipWheel, Send, Boxes, Search, PackageCheck, FileText }

// Hover motion per service icon — each hints at what the service does.
const iconHover = {
  ShipWheel: { rotate: 120, transition: { duration: 0.8, ease: 'easeInOut' } }, // steering the ship
  Send: { x: [0, 6, -2, 0], y: [0, -6, 2, 0], transition: { duration: 0.7 } }, // dispatched
  Boxes: { y: [0, -4, 0, -2, 0], transition: { duration: 0.8 } }, // stacked, settling
  Search: { rotate: [0, -14, 10, 0], scale: 1.1, transition: { duration: 0.7 } }, // scanning mills
  PackageCheck: { y: [0, -5, 0], scale: [1, 1.08, 1], transition: { duration: 0.6 } }, // packed & checked
  FileText: { rotate: [0, -6, 6, 0], transition: { duration: 0.6 } }, // paperwork
}

function ServiceCard({ service, index }) {
  const reduce = useReducedMotion()
  const Icon = iconMap[service.icon] || Package

  // Gentle 3D tilt that follows the pointer.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 })

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    // Tips up from flat as it scrolls in; cards further along the row start a little later.
    <Scrub
      from={{ opacity: 0, rotateX: -75, y: 50 }}
      range={[(index % 3) * 0.12, 0.7 + (index % 3) * 0.12]}
      offset={['start 100%', 'start 55%']}
      style={{ transformPerspective: 900, transformOrigin: 'top center' }}
    >
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        whileHover="hover"
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        className="h-full bg-ivory rounded-2xl p-8 border border-line/60 hover:border-gold/40 hover:shadow-[0_24px_50px_-25px_rgba(14,59,44,0.4)] transition-[box-shadow,border-color] duration-300"
      >
        <div className="w-12 h-12 rounded-full bg-deep/5 border border-deep/10 flex items-center justify-center mb-6">
          <motion.span className="inline-flex" variants={{ hover: iconHover[service.icon] ?? { scale: 1.1 } }}>
            <Icon className="w-5.5 h-5.5 text-deep" />
          </motion.span>
        </div>
        <h3 className="font-display text-xl font-semibold text-ink mb-3">{service.name}</h3>
        <p className="text-sm text-slate leading-relaxed">{service.blurb}</p>
      </motion.div>
    </Scrub>
  )
}

export default function ServicesGrid({ showHeading = true }) {
  return (
    <section className="bg-sand/50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        {showHeading && (
          <Scrub from={{ opacity: 0, y: 40 }} className="max-w-2xl mb-12">
            <SectionTag>What We Do</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
              Rice Trade Services Built Around <span className="display-accent text-rust">Your Supply Chain</span>
            </h2>
          </Scrub>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {services.map((s, i) => (
            <ServiceCard key={s.name} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
