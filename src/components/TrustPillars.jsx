import { motion } from 'framer-motion'
import { BadgeCheck, Ship, HandCoins, FileCheck2 } from 'lucide-react'

const pillars = [
  {
    icon: BadgeCheck,
    title: 'Quality Assured',
    blurb: 'Every consignment checked against agreed specification before it ships.',
  },
  {
    icon: Ship,
    title: 'Global Logistics',
    blurb: 'Import and export documentation, freight and customs handled end-to-end.',
  },
  {
    icon: HandCoins,
    title: 'Competitive Pricing',
    blurb: 'Direct sourcing relationships keep bulk and wholesale pricing sharp.',
  },
  {
    icon: FileCheck2,
    title: 'Trusted Compliance',
    blurb: 'VAT registered and licensed by Dubai Economy and Tourism.',
  },
]

export default function TrustPillars() {
  return (
    <section className="bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-7 rounded-2xl border border-line/60 bg-sand/40 hover:border-gold/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-deep flex items-center justify-center mb-5">
                <p.icon className="w-5.5 h-5.5 text-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink mb-2">{p.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{p.blurb}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
