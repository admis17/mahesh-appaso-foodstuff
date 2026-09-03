import { motion } from 'framer-motion'
import { process } from '../data/regions'
import SectionTag from './SectionTag'

export default function ProcessSteps() {
  return (
    <section className="bg-deep text-ivory overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        <div className="max-w-2xl mb-14">
          <SectionTag light>How It Works</SectionTag>
          <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] mt-5">
            From Mill to <span className="display-accent text-gold-light">Your Doorstep</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {process.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-0"
            >
              <span className="font-display text-4xl sm:text-5xl font-semibold text-ivory/15 block mb-4">{step.step}</span>
              <h3 className="font-display text-lg font-semibold text-gold-light mb-2.5">{step.title}</h3>
              <p className="text-sm text-ivory/65 leading-relaxed">{step.blurb}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
