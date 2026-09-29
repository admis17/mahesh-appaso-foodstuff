import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import JsonLd from '../components/JsonLd'
import PageHero from '../components/PageHero'
import CTASection from '../components/CTASection'
import NotFound from './NotFound'
import FlipCard from '../components/FlipCard'
import useMediaQuery, { LG } from '../components/motion/useMediaQuery'
import { getCategory, getGroupedProducts, getProductsByCategory, productCategories, subcategoryLabel } from '../data/products'
import { company, siteUrl } from '../data/company'

export default function ProductCategory() {
  const { category: slug } = useParams()
  const lg = useMediaQuery(LG)
  const sm = useMediaQuery('(min-width: 640px)')
  const cols = lg ? 3 : sm ? 2 : 1
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
        effect="focus"
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
              const row = Math.floor(i / cols)
              const col = i % cols
              return (
                // Cascade: cards arrive in a diagonal wave from the top-left corner.
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: (row + col) * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  <FlipCard product={p} type={subcategoryLabel(slug, p.subcategory)} number={i + 1} href={`/products/${slug}/${p.id}`} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <CTASection
        effect="magnetic"
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
