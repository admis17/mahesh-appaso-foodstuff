import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import JsonLd from '../components/JsonLd'
import PageHero from '../components/PageHero'
import CTASection from '../components/CTASection'
import NotFound from './NotFound'
import { getCategory, getGroupedProducts, getProductsByCategory, productCategories, subcategoryLabel, ON_ENQUIRY } from '../data/products'
import { company, siteUrl } from '../data/company'

export default function ProductCategory() {
  const { category: slug } = useParams()
  const category = getCategory(slug)
  if (!category) return <NotFound />

  const items = getProductsByCategory(slug)
  const groups = getGroupedProducts(slug)
  const other = productCategories.find((c) => c.slug !== slug)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        category: category.name,
        countryOfOrigin: p.origin,
        brand: { '@type': 'Organization', name: company.brandShort },
        url: `${siteUrl}/products/${slug}/${p.id}`,
      },
    })),
  }

  return (
    <>
      <Seo
        title={`${category.title} | Mahesh Rice Trading`}
        description={`${category.name} traded from Dubai — ${items.map((p) => p.name).join(', ')}. Origin India, specifications on enquiry.`}
        path={`/products/${slug}`}
      />
      <JsonLd data={schema} />
      <PageHero
        tag={`Commodity Records — ${String(productCategories.indexOf(category) + 1).padStart(2, '0')}`}
        title={`${category.name}. The ${slug === 'rice' ? 'Grain' : 'Legume'} Record.`}
        accent={`The ${slug === 'rice' ? 'Grain' : 'Legume'} Record.`}
        body={`Origin India · ${items.length} active entries · ${groups.length} ${groups.length === 1 ? 'family' : 'families'}`}
        image={category.image}
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: category.name }]} />

      <section className="bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, i) => {
              const type = subcategoryLabel(slug, p.subcategory)
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                >
                  <Link
                    to={`/products/${slug}/${p.id}`}
                    className="group block h-full rounded-2xl border border-line/60 bg-sand/30 p-7 hover:border-gold transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-2xl text-gold/50">{String(i + 1).padStart(3, '0')}</span>
                      <span className="eyebrow px-3 py-1 rounded-full bg-deep text-gold-light">{p.entry}</span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-ink mb-2">{p.name}</h3>
                    <p className="text-xs uppercase tracking-wide text-slate mb-5">
                      {type} · {p.origin} · {p.processing}
                    </p>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
                      {[
                        ['Origin', p.origin],
                        ['Process', p.processing],
                        ['Type', type],
                        ['Spec', p.specs[0] ?? ON_ENQUIRY],
                      ].map(([k, v]) => (
                        <div key={k} className={`border-t border-line/60 pt-2 ${k === 'Spec' ? 'col-span-2' : ''}`}>
                          <dt className="text-[11px] uppercase tracking-wide text-slate/80">{k}</dt>
                          <dd className="text-sm font-semibold text-ink first-letter:uppercase">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-deep group-hover:text-gold transition-colors">
                      View Record <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <CTASection
        tag="Contact"
        title="Ready to Source?"
        accent="Source?"
        body="Tell us the product, grade, packaging and quantity you need — specifications are confirmed on enquiry."
        primary={{ to: '/contact', label: 'Request a Quote' }}
        secondary={{ to: `/products/${other.slug}`, label: other.name }}
      />
    </>
  )
}
