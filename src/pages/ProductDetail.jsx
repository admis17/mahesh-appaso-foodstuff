import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import JsonLd from '../components/JsonLd'
import PageHero from '../components/PageHero'
import SectionTag from '../components/SectionTag'
import Button from '../components/Button'
import SlotReel from '../components/motion/SlotReel'
import NotFound from './NotFound'
import { getCategory, getProduct, getProductsByCategory, subcategoryLabel, ON_ENQUIRY } from '../data/products'
import { company, siteUrl } from '../data/company'

const list = (arr) => (arr.length ? arr.join(' · ') : ON_ENQUIRY)

// "Broken grades: 5% / 10% / 15%" → ['5%', '10%', '15%']
const brokenGrades = (specs) => {
  const m = specs.map((s) => s.match(/^Broken grades:\s*(.+)$/i)).find(Boolean)
  return m ? m[1].split('/').map((g) => g.trim()) : []
}

const quoteHref = (product, grade) =>
  `/contact?product=${encodeURIComponent(`${product.name}${grade ? ` — ${grade} broken` : ''}`)}`

// Spec sheet folds: first panel lies flat, the next ones swing down from their top edge.
const sheet = { hidden: {}, show: { transition: { staggerChildren: 0.28, delayChildren: 0.15 } } }
const fold = {
  hidden: (i) => (i === 0 ? { opacity: 0 } : { rotateX: -92, opacity: 0.4 }),
  show: (i) => (i === 0 ? { opacity: 1, transition: { duration: 0.4 } } : { rotateX: 0, opacity: 1, transition: { duration: 0.7, ease: [0.3, 1.2, 0.4, 1] } }),
}

export default function ProductDetail() {
  const { category: slug, id } = useParams()
  const reduce = useReducedMotion()
  const [grade, setGrade] = useState(null)
  const [showBar, setShowBar] = useState(false)
  const specRef = useRef(null)
  const { scrollY } = useScroll()

  // Mobile quote bar appears once the spec sheet has scrolled past.
  useMotionValueEvent(scrollY, 'change', () => {
    const el = specRef.current
    if (!el) return
    const passed = el.getBoundingClientRect().bottom < 80
    setShowBar((cur) => (cur === passed ? cur : passed))
  })

  const category = getCategory(slug)
  const product = getProduct(slug, id)
  if (!category || !product) return <NotFound />

  const type = subcategoryLabel(slug, product.subcategory)
  const grades = brokenGrades(product.specs)
  const siblings = getProductsByCategory(slug)
  const idx = siblings.indexOf(product)
  const adjacent = [siblings[idx + 1], siblings[idx + 2]].filter(Boolean)
  if (adjacent.length < 2) adjacent.push(...siblings.filter((p) => p !== product && !adjacent.includes(p)).slice(0, 2 - adjacent.length))

  const rows = [
    ['Origin', product.origin],
    ['Processing', product.processing],
    ['Type', type],
    ['Specification', list(product.specs)],
    ['Packaging', list(product.packaging)],
    ['Markets', list(product.markets)],
  ]
  const panels = [rows.slice(0, 2), rows.slice(2, 4), rows.slice(4, 6)]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.entry,
    category: `${category.name} / ${type}`,
    countryOfOrigin: product.origin,
    description: `${product.name} — ${type}, ${product.processing}, origin ${product.origin}.${product.specs.length ? ` ${product.specs.join('. ')}.` : ''}`,
    brand: { '@type': 'Organization', name: company.brandShort },
    url: `${siteUrl}/products/${slug}/${product.id}`,
  }

  return (
    <>
      <Seo
        title={`${product.name} — Commodity Record | Mahesh Rice Trading`}
        description={`${product.name} (${type}, ${product.processing}) from ${product.origin}, traded from Dubai.${product.specs.length ? ` ${product.specs[0]}.` : ''} Packaging and markets on enquiry.`}
        path={`/products/${slug}/${product.id}`}
      />
      <JsonLd data={schema} />
      <PageHero
        effect="loupe"
        tag={`Commodity Record — ${category.name} / ${type}`}
        title={product.name}
        body={`Specimen — ${product.origin} · ${product.entry}`}
        image={category.image}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Products', to: '/products' },
          { label: category.name, to: `/products/${slug}` },
          { label: product.name },
        ]}
      />

      <section className="bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-10 lg:gap-16">
          <div>
            <SectionTag>Specification — {product.entry}</SectionTag>
            <div className="flex flex-wrap items-center gap-3 mt-6 mb-8">
              <span className="eyebrow px-3 py-1 rounded-full bg-deep text-gold-light">Status {product.status}</span>
              <span className="inline-flex items-center gap-1.5 eyebrow text-deep">
                <BadgeCheck className="w-4 h-4 text-gold" /> {product.verification}
              </span>
            </div>

            {/* Spec sheet that unfolds panel by panel */}
            <motion.dl
              ref={specRef}
              className="[perspective:1400px]"
              variants={sheet}
              initial={reduce ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              {panels.map((panel, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fold}
                  style={{ transformOrigin: 'top center' }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 pb-5 bg-ivory"
                >
                  {panel.map(([k, v]) => (
                    <div key={k} className="border-t border-line/60 pt-3">
                      <dt className="text-[11px] uppercase tracking-wide text-slate/80">{k}</dt>
                      <dd className="text-base font-semibold text-ink first-letter:uppercase">{v}</dd>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.dl>

            {/* Broken-grade picker — the chosen grade travels into the quote request */}
            {grades.length > 0 && (
              <div className="mt-8">
                <p className="eyebrow text-slate mb-3">Choose a broken grade</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Broken grade">
                  {grades.map((g, i) => {
                    const on = grade === g
                    return (
                      <motion.button
                        key={g}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setGrade(on ? null : g)}
                        initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 500, damping: 22 }}
                        className={`relative rounded-full px-5 py-2 text-sm font-semibold border transition-colors ${
                          on ? 'bg-gold border-gold text-deep' : 'border-line text-ink hover:border-gold'
                        }`}
                      >
                        {g}
                      </motion.button>
                    )
                  })}
                </div>
                <AnimatePresence>
                  {grade && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-slate mt-3 overflow-hidden"
                    >
                      Your quote request will mention <strong className="text-ink">{grade} broken</strong>.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="mt-10 rounded-2xl bg-sand/40 border border-line/60 p-6">
              <p className="eyebrow text-slate mb-2">Provenance</p>
              <p className="font-display text-xl text-ink">
                <SlotReel word={product.origin} delay={0.1} /> → <SlotReel word="Dubai" delay={0.35} spins={6} /> →{' '}
                <SlotReel word="Destination." delay={0.6} spins={7} />
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Button to={quoteHref(product, grade)} variant="deep">Request a Quote</Button>
              <Button to={`/products/${slug}`} variant="outline-dark">Back to {category.name}</Button>
            </div>
          </div>

          {adjacent.length > 0 && (
            <aside>
              <p className="eyebrow text-slate mb-4">Adjacent Records</p>
              <ul className="space-y-3">
                {adjacent.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/products/${slug}/${p.id}`}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-line/60 bg-sand/30 px-5 py-4 hover:border-gold transition-colors"
                    >
                      <span className="min-w-0">
                        {/* On hover the entry number slides out and the spec line slides in. */}
                        <span className="relative block h-4 overflow-hidden text-[11px] uppercase tracking-wide">
                          <span className="absolute inset-0 text-slate/80 transition-transform duration-300 group-hover:-translate-x-[110%]">{p.entry}</span>
                          <span className="absolute inset-0 truncate text-gold translate-x-[110%] transition-transform duration-300 group-hover:translate-x-0">
                            {p.specs[0] ?? p.processing}
                          </span>
                        </span>
                        <span className="block font-semibold text-ink">{p.name}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-gold shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>

      {/* Phone-only sticky quote bar (kept clear of the WhatsApp button on the right) */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            className="lg:hidden fixed bottom-5 left-5 right-24 z-40"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <Link
              to={quoteHref(product, grade)}
              className="flex items-center justify-between gap-3 rounded-full bg-deep text-ivory pl-5 pr-2 py-2 shadow-xl shadow-black/25"
            >
              <span className="text-sm font-semibold truncate">
                Quote for {product.shortName}
                {grade ? ` · ${grade}` : ''}
              </span>
              <span className="w-9 h-9 shrink-0 rounded-full bg-gold text-deep flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
