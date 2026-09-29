import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import Seo from '../components/Seo'
import Button from '../components/Button'
import SectionTag from '../components/SectionTag'

const WAVE = 'M0 20 q 25 -14 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 V60 H0 Z'

/** "Lost at sea": a lone container bobbing on looping swells; layers shift with the pointer. */
function LostContainer() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const far = useTransform(sx, (v) => v * -10)
  const mid = useTransform(sx, (v) => v * -22)
  const near = useTransform(sx, (v) => v * -38)

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
  }

  const wave = (reverse) => (reduce ? undefined : { x: reverse ? [-100, 0] : [0, -100] })
  const loop = (duration) => ({ duration, repeat: Infinity, ease: 'linear' })

  return (
    <div onPointerMove={onMove} className="relative mx-auto w-full max-w-xl h-56 sm:h-64 overflow-hidden rounded-3xl bg-deep" aria-hidden="true">
      {/* moon */}
      <motion.div style={{ x: far }} className="absolute top-8 right-16 w-12 h-12 rounded-full bg-gold-light/80 shadow-[0_0_40px_rgba(233,197,120,0.5)]" />

      {/* far swell */}
      <motion.svg style={{ x: far }} viewBox="0 0 600 60" preserveAspectRatio="none" className="absolute bottom-16 -left-10 w-[130%] h-16">
        <motion.path d={WAVE} fill="rgba(251,248,241,0.06)" animate={wave(true)} transition={loop(9)} />
      </motion.svg>

      {/* container */}
      <motion.div style={{ x: mid }} className="absolute left-1/2 bottom-12 -ml-14">
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-28 h-14 rounded-sm bg-rust relative shadow-lg"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="absolute top-1.5 bottom-1.5 w-px bg-deep/30" style={{ left: `${18 + i * 16}%` }} />
          ))}
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-[0.2em] text-ivory/90">404</span>
        </motion.div>
      </motion.div>

      {/* near swell */}
      <motion.svg style={{ x: near }} viewBox="0 0 600 60" preserveAspectRatio="none" className="absolute -bottom-2 -left-10 w-[130%] h-20">
        <motion.path d={WAVE} fill="rgba(217,164,65,0.28)" animate={wave(false)} transition={loop(5)} />
      </motion.svg>
    </div>
  )
}

export default function NotFound() {
  const reduce = useReducedMotion()
  return (
    <>
      <Seo
        title="Page Not Found | Mahesh Rice Trading"
        description="The page you're looking for doesn't exist."
        path="/404"
        noindex
      />
      <section className="bg-ivory min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <LostContainer />
          <SectionTag className="justify-center mt-10">Lost at sea</SectionTag>
          <h1 className="display-heading text-[clamp(2rem,4vw,3rem)] text-ink mt-5 mb-6">
            This Container Drifted <span className="display-accent text-rust">Off Route</span>
          </h1>
          <p className="text-slate text-lg mb-9 leading-relaxed">
            The page you're looking for may have moved or no longer exists. Let's get you back to port.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.span
              className="inline-flex"
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Button to="/" variant="gold" size="lg">Back to Home</Button>
            </motion.span>
            <Button to="/products" variant="outline-dark" size="lg">View Products</Button>
          </div>
        </div>
      </section>
    </>
  )
}
