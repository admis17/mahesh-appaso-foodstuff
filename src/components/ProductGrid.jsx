import { motion } from 'framer-motion'
import { riceCategories } from '../data/products'
import SectionTag from './SectionTag'
import Button from './Button'

export default function ProductGrid({ showHeading = true }) {
  return (
    <section id="products" className="bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        {showHeading && (
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <SectionTag>Our Products</SectionTag>
              <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5 max-w-xl">
                Rice We <span className="display-accent text-rust">Trade</span>
              </h2>
              <p className="text-slate mt-4 max-w-md leading-relaxed">
                Explore our range of Basmati and Non-Basmati rice, available for international
                markets and bulk requirements.
              </p>
            </div>
            <Button to="/products" variant="outline-dark">View All Rice</Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-7">
          {riceCategories.map((c, i) => (
            <motion.div
              key={c.slug}
              id={c.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] scroll-mt-28"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/35 to-deep/5" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-ivory mb-2">{c.name}</h3>
                <p className="text-ivory/75 text-sm leading-relaxed max-w-sm mb-5">{c.blurb}</p>
                <Button to={`/products/${c.slug}`} variant="gold" size="sm">View {c.name}</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
