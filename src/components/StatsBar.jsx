import { motion } from 'framer-motion'

const stats = [
  { value: '12', label: 'Products — Rice & Pulses' },
  { value: '6', label: 'Regions Served Worldwide' },
  { value: '100%', label: 'Lots Checked Before Dispatch' },
  { value: 'Dubai', label: 'Home Base, UAE' },
]

export default function StatsBar() {
  return (
    <section className="bg-deep text-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center sm:text-left"
            >
              <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-gold-light mb-2">{s.value}</p>
              <p className="text-xs sm:text-sm text-ivory/65 leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
