import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { testimonials } from '../data/testimonials'
import SectionTag from './SectionTag'

export default function Testimonials() {
  return (
    <section className="bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        <div className="max-w-2xl mb-12">
          <SectionTag>Trade Partners</SectionTag>
          <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
            What Buyers <span className="display-accent text-rust">Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-sand/50 rounded-2xl p-8 border border-line/60"
            >
              <Quote className="w-7 h-7 text-gold mb-5" />
              <p className="text-ink/85 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-display font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-slate mt-0.5">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
