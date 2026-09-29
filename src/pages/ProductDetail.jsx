import { Link, useParams } from 'react-router-dom'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import JsonLd from '../components/JsonLd'
import PageHero from '../components/PageHero'
import SectionTag from '../components/SectionTag'
import Button from '../components/Button'
import NotFound from './NotFound'
import { getCategory, getProduct, getProductsByCategory, subcategoryLabel, ON_ENQUIRY } from '../data/products'
import { company, siteUrl } from '../data/company'

const list = (arr) => (arr.length ? arr.join(' · ') : ON_ENQUIRY)

export default function ProductDetail() {
  const { category: slug, id } = useParams()
  const category = getCategory(slug)
  const product = getProduct(slug, id)
  if (!category || !product) return <NotFound />

  const type = subcategoryLabel(slug, product.subcategory)
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
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {rows.map(([k, v]) => (
                <div key={k} className="border-t border-line/60 pt-3">
                  <dt className="text-[11px] uppercase tracking-wide text-slate/80">{k}</dt>
                  <dd className="text-base font-semibold text-ink first-letter:uppercase">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 rounded-2xl bg-sand/40 border border-line/60 p-6">
              <p className="eyebrow text-slate mb-2">Provenance</p>
              <p className="font-display text-xl text-ink">{product.origin} → Dubai → Destination.</p>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Button to="/contact" variant="deep">Request a Quote</Button>
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
                      <span>
                        <span className="block text-[11px] uppercase tracking-wide text-slate/80">{p.entry}</span>
                        <span className="block font-semibold text-ink">{p.name}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-gold shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>
    </>
  )
}
