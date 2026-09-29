import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { products, productCategories, subcategoryLabel, ON_ENQUIRY } from '../data/products'

const active = products.filter((p) => p.status === 'active')

// Filters: everything, each category, then every subcategory that actually has products.
const filters = [
  { key: 'all', label: 'All', test: () => true },
  ...productCategories.map((c) => ({ key: c.slug, label: c.name, test: (p) => p.category === c.slug })),
  ...productCategories.flatMap((c) =>
    c.groups
      .filter((g) => active.some((p) => p.category === c.slug && p.subcategory === g.key))
      .map((g) => ({ key: `${c.slug}:${g.key}`, label: g.label, test: (p) => p.category === c.slug && p.subcategory === g.key })),
  ),
]

/** The full product list as a filterable manifest; rows reshuffle smoothly when the filter changes. */
export default function ProductManifest() {
  const [filter, setFilter] = useState('all')
  const shown = active.filter(filters.find((f) => f.key === filter).test)

  return (
    <section className="bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        <LayoutGroup>
          {/* Filter chips with a sliding active pill */}
          <div role="toolbar" aria-label="Filter products" className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => {
              const on = f.key === filter
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.key)}
                  className={`relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    on ? 'text-ivory' : 'text-slate hover:text-deep border border-line'
                  }`}
                >
                  {on && <motion.span layoutId="manifest-pill" className="absolute inset-0 rounded-full bg-deep" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative">{f.label}</span>
                </button>
              )
            })}
          </div>

          <div className="hidden md:grid grid-cols-[7rem_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.6fr)_2rem] gap-4 px-5 pb-3 border-b border-line text-[11px] uppercase tracking-[0.16em] text-slate">
            <span>Entry</span>
            <span>Product</span>
            <span>Type</span>
            <span>Process</span>
            <span>Specification</span>
            <span />
          </div>

          <motion.ul layout className="relative" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((p) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  className="border-b border-line/70"
                >
                  <Link
                    to={`/products/${p.category}/${p.id}`}
                    className="shine group grid grid-cols-[1fr_auto] md:grid-cols-[7rem_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.6fr)_2rem] gap-x-4 gap-y-1 items-center px-5 py-5 hover:bg-sand/60 transition-colors"
                  >
                    <span className="text-xs font-semibold text-gold tracking-wider order-1 md:order-none">{p.entry}</span>
                    <span className="font-display text-lg font-semibold text-ink col-span-2 md:col-span-1 order-3 md:order-none">{p.name}</span>
                    <span className="text-sm text-slate order-4 md:order-none">{subcategoryLabel(p.category, p.subcategory)}</span>
                    <span className="text-sm text-slate capitalize hidden md:block">{p.processing}</span>
                    <span className="text-sm text-ink/80 col-span-2 md:col-span-1 order-5 md:order-none">{p.specs[0] ?? ON_ENQUIRY}</span>
                    <ArrowRight className="w-4 h-4 text-gold justify-self-end order-2 md:order-none transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          <p className="mt-6 text-sm text-slate">
            Showing {shown.length} of {active.length} products · specifications confirmed on enquiry
          </p>
        </LayoutGroup>
      </div>
    </section>
  )
}
