import { motion } from 'framer-motion'
import Button from './Button'
import SectionTag from './SectionTag'

export default function CTASection({
  tag = 'Start Your Order',
  title = 'Ready to Source With Confidence?',
  accent = 'Confidence?',
  body = "Whether you're a buyer, distributor or importer — tell us what you need and we'll get back with a quote.",
  primary = { to: '/contact', label: 'Request a Quote' },
  secondary = { to: '/products', label: 'View Products' },
}) {
  const [before] = title.split(accent)

  return (
    <section className="bg-sand/50">
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="bg-deep rounded-3xl py-14 sm:py-20 px-8 sm:px-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
          <div className="relative">
            <SectionTag light className="justify-center">{tag}</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ivory mt-6 mb-6 text-balance">
              {before}
              <span className="display-accent text-gold-light">{accent}</span>
            </h2>
            <p className="text-ivory/70 text-base sm:text-lg mb-9 max-w-xl mx-auto leading-relaxed">{body}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button to={primary.to} variant="gold" size="lg">{primary.label}</Button>
              <Button to={secondary.to} variant="outline" size="lg">{secondary.label}</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
