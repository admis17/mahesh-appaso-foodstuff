import { motion } from 'framer-motion'
import { ShipWheel, Send, Boxes, Search, PackageCheck, FileText, Package } from 'lucide-react'
import { services } from '../data/services'
import SectionTag from './SectionTag'

const iconMap = { ShipWheel, Send, Boxes, Search, PackageCheck, FileText }

export default function ServicesGrid({ showHeading = true }) {
  return (
    <section className="bg-sand/50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        {showHeading && (
          <div className="max-w-2xl mb-12">
            <SectionTag>What We Do</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
              Rice Trade Services Built Around <span className="display-accent text-rust">Your Supply Chain</span>
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] || Package
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="bg-ivory rounded-2xl p-8 border border-line/60 hover:shadow-[0_20px_50px_-25px_rgba(14,59,44,0.35)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-deep/5 border border-deep/10 flex items-center justify-center mb-6">
                  <Icon className="w-5.5 h-5.5 text-deep" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{s.name}</h3>
                <p className="text-sm text-slate leading-relaxed">{s.blurb}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
