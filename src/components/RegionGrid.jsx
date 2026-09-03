import { motion } from 'framer-motion'
import { Globe2 } from 'lucide-react'
import { regions } from '../data/regions'
import SectionTag from './SectionTag'

export default function RegionGrid({ showHeading = true }) {
  return (
    <section className="relative bg-sand/50 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        {showHeading && (
          <div className="max-w-2xl mb-12">
            <SectionTag>Global Reach</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
              Rice Exports Across <span className="display-accent text-rust">Six Regions</span>
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-ivory rounded-2xl p-7 sm:p-8 border border-line/60 flex items-start gap-5"
            >
              <div className="w-12 h-12 rounded-full bg-deep flex items-center justify-center shrink-0">
                <Globe2 className="w-5.5 h-5.5 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-ink mb-2">{r.name}</h3>
                <p className="text-sm text-slate leading-relaxed">{r.countries}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
