import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { productCategories, getProductsByCategory } from '../data/products'
import SectionTag from './SectionTag'
import Button from './Button'
import Scrub from './motion/Scrub'
import ScrubNumber from './motion/ScrubNumber'
import { useScrub, useSlice } from './motion/useScrub'

/** A category card that slides in from its own side as you scroll, its record count climbing along. */
function CategoryCard({ category: c, index: i }) {
  const ref = useRef(null)
  const items = getProductsByCategory(c.slug)
  const progress = useScrub(ref, ['start 95%', 'start 45%'])
  const count = useSlice(progress, [0.35, 1])

  return (
    <Scrub
      ref={ref}
      id={c.slug}
      progress={progress}
      from={{ opacity: 0, x: i % 2 === 0 ? -110 : 110, rotate: i % 2 === 0 ? -3 : 3 }}
      className="group relative rounded-2xl overflow-hidden min-h-[26rem] lg:min-h-0 lg:aspect-[4/3] flex flex-col justify-end scroll-mt-28"
    >
      <img
        src={c.image}
        alt={c.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/45 to-deep/5 transition-colors duration-500 lg:group-hover:from-deep lg:group-hover:via-deep/70" />
      <div className="relative p-7 sm:p-8">
        <h3 className="font-display text-2xl font-semibold text-ivory mb-2">{c.name}</h3>
        <p className="eyebrow text-gold-light mb-2">
          <ScrubNumber progress={count} to={items.length} pad={2} /> Active Records
        </p>
        <p className="text-ivory/75 text-sm leading-relaxed max-w-sm mb-5">{c.blurb}</p>

        {/* Product names: always shown on touch-sized screens, revealed on hover/focus on desktop. */}
        <div className="grid grid-rows-[1fr] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
          <div className="min-h-0 overflow-hidden">
            <ul className="flex flex-wrap gap-2 pb-5">
              {items.map((p, j) => (
                <li
                  key={p.id}
                  className="lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-focus-within:opacity-100 lg:group-focus-within:translate-y-0 transition-all duration-300"
                  style={{ transitionDelay: `${80 + j * 35}ms` }}
                >
                  <Link
                    to={`/products/${c.slug}/${p.id}`}
                    className="inline-block rounded-full border border-ivory/25 bg-ivory/10 px-3 py-1 text-xs text-ivory hover:border-gold hover:text-gold-light transition-colors"
                  >
                    {p.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button to={`/products/${c.slug}`} variant="gold" size="sm">View {c.name}</Button>
      </div>
    </Scrub>
  )
}

export default function ProductGrid({ showHeading = true }) {
  return (
    <section id="products" className="bg-ivory overflow-x-clip">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        {showHeading && (
          <Scrub from={{ opacity: 0, y: 40 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <SectionTag>Our Products</SectionTag>
              <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5 max-w-xl">
                Rice &amp; Pulses We <span className="display-accent text-rust">Trade</span>
              </h2>
              <p className="text-slate mt-4 max-w-md leading-relaxed">
                Explore our range of rice and pulses, sourced from India and available for international
                markets and bulk requirements.
              </p>
            </div>
            <Button to="/products" variant="outline-dark">View All Products</Button>
          </Scrub>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-7">
          {productCategories.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
