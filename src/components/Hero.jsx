import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Button from './Button'
import SectionTag from './SectionTag'
import RotatingProduct from './hero/RotatingProduct'
import FallingGrains from './motion/FallingGrains'
import ProductTicker from './hero/ProductTicker'
import CargoRoute from './hero/CargoRoute'
import CountUp from './motion/CountUp'
import Credentials from './hero/Credentials'
import Magnetic from './motion/Magnetic'
import { products, productCategories } from '../data/products'

const ease = [0.22, 1, 0.36, 1]

// Headline, copy and buttons build up one after another.
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } }
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

const stats = [
  { value: products.filter((p) => p.status === 'active').length, label: 'Products on record' },
  { value: 6, label: 'Regions served' },
  { value: productCategories.length, label: 'Commodity lines' },
]

export default function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  // Scroll-out: as the hero scrolls away the copy lifts and fades, the trade card drifts at a
  // different speed and the photo pushes in. Scrolling back up plays it in reverse.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const out = useSpring(scrollYProgress, { stiffness: 170, damping: 32, restDelta: 0.0005 })
  const copyY = useTransform(out, [0, 1], [0, reduce ? 0 : -160])
  const copyOpacity = useTransform(out, [0, 0.75], [1, reduce ? 1 : 0])
  const cardY = useTransform(out, [0, 1], [0, reduce ? 0 : -260])
  const photoScale = useTransform(out, [0, 1], [1, reduce ? 1 : 1.25])

  return (
    <section ref={ref} className="relative overflow-hidden bg-deep text-ivory">
      <motion.div className="absolute inset-0" style={{ scale: photoScale }}>
        <motion.img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1800&auto=format&fit=crop"
          alt="Shipping containers at a busy port"
          className="w-full h-full object-cover opacity-40 will-change-transform"
          initial={{ scale: 1 }}
          animate={reduce ? undefined : { scale: 1.12 }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity, repeatType: 'mirror' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/90 to-deep/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent" />
      </motion.div>

      <FallingGrains className="hidden sm:block" />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 sm:pt-20 pb-14 sm:pb-16 min-h-[88vh] sm:min-h-[92vh] flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_24rem] gap-12 lg:gap-16 items-center">
          <motion.div variants={stagger} initial={reduce ? false : 'hidden'} animate="show">
            <motion.div variants={rise}>
              <SectionTag light>Rice &amp; Pulses Trading · Based in Dubai, UAE</SectionTag>
            </motion.div>

            <h1 className="display-hero text-[clamp(2.6rem,7vw,5.5rem)] mt-6 mb-8 max-w-3xl">
              <span className="sr-only">Rice &amp; Pulses, Exported From Dubai</span>
              <motion.span variants={rise} className="block">
                <RotatingProduct />
              </motion.span>
              <motion.span variants={rise} className="block display-accent text-gold-light" aria-hidden="true">
                Exported From Dubai
              </motion.span>
            </h1>

            <motion.p variants={rise} className="text-ivory/75 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
              Mahesh Rice Trading supplies Indian rice and pulses to wholesale
              buyers across the GCC, Africa, Asia, Europe and the Americas.
            </motion.p>

            <motion.div variants={rise} className="flex flex-wrap items-center gap-4">
              <Button to="/products" variant="gold" size="lg">Explore Products</Button>
              {/* Leans toward the cursor; one soft pulse a few seconds in draws the eye to it. */}
              <Magnetic>
                <motion.span
                  className="inline-flex rounded-full"
                  initial={{ boxShadow: '0 0 0 0 rgba(233,197,120,0)' }}
                  animate={
                    reduce
                      ? undefined
                      : { boxShadow: ['0 0 0 0 rgba(233,197,120,0)', '0 0 0 10px rgba(233,197,120,0.35)', '0 0 0 22px rgba(233,197,120,0)'] }
                  }
                  transition={{ duration: 1.5, delay: 3, ease: 'easeOut' }}
                >
                  <Button to="/contact" variant="outline" size="lg">Get a Quote</Button>
                </motion.span>
              </Magnetic>
            </motion.div>
          </motion.div>

          <motion.aside
            aria-label="Trade record"
            style={{ y: cardY }}
            initial={reduce ? false : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
            className="rounded-2xl border border-ivory/15 bg-deep/55 backdrop-blur-md p-6 sm:p-7"
          >
            <p className="eyebrow text-gold-light">Trade Record</p>
            <CargoRoute delay={1.2} />
            <dl className="grid grid-cols-3 gap-4 pt-5 border-t border-ivory/15">
              {stats.map((s, i) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="text-[11px] leading-snug text-ivory/60 mt-1">{s.label}</dt>
                  <dd className="font-display text-3xl sm:text-4xl font-semibold text-gold-light tabular-nums">
                    <CountUp to={s.value} delay={1 + i * 0.15} />
                  </dd>
                </div>
              ))}
            </dl>
          </motion.aside>
        </div>

        <div className="mt-12 pt-8 border-t border-ivory/15">
          <Credentials delay={1.7} />
        </div>
      </motion.div>

      <div className="relative">
        <ProductTicker />
      </div>
    </section>
  )
}
