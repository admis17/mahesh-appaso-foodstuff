import { motion } from 'framer-motion'
import { ShieldCheck, Globe2, Award } from 'lucide-react'
import Button from './Button'
import SectionTag from './SectionTag'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-deep text-ivory">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1800&auto=format&fit=crop"
          alt="Shipping containers at a busy port"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/90 to-deep/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 sm:pt-20 pb-20 sm:pb-28 min-h-[88vh] sm:min-h-[92vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionTag light>Rice &amp; Pulses Trading · Based in Dubai, UAE</SectionTag>

          <h1 className="display-hero text-[clamp(2.6rem,7vw,5.5rem)] mt-6 mb-8 max-w-3xl text-balance">
            Rice &amp; Pulses,
            <br />
            <span className="display-accent text-gold-light">Exported From Dubai</span>
          </h1>

          <p className="text-ivory/75 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
            Mahesh Rice Trading supplies Indian rice and pulses to wholesale
            buyers across the GCC, Africa, Asia, Europe and the Americas.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-14">
            <Button to="/products" variant="gold" size="lg">Explore Products</Button>
            <Button to="/contact" variant="outline" size="lg">Get a Quote</Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8 border-t border-ivory/15"
        >
          {[
            [ShieldCheck, 'TRN Registered with the FTA'],
            [Award, 'Licensed by Dubai Economy & Tourism'],
            [Globe2, 'Trading Across 6 Global Regions'],
          ].map(([Icon, label], i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-ivory/75">
              <Icon className="w-4 h-4 text-gold shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
