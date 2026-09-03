import { motion } from 'framer-motion'
import { Gem, PackageCheck, Repeat } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import JsonLd from '../components/JsonLd'
import PageHero from '../components/PageHero'
import SectionTag from '../components/SectionTag'
import VarietyGrid from '../components/VarietyGrid'
import CTASection from '../components/CTASection'
import { basmatiVarieties } from '../data/products'
import { company, siteUrl } from '../data/company'

const features = [
  { icon: Gem, title: 'Premium Grain', blurb: 'Selected for length, aroma and appearance.' },
  { icon: PackageCheck, title: 'Export Ready', blurb: 'Prepared for international shipments.' },
  { icon: Repeat, title: 'Consistent Supply', blurb: 'Reliable sourcing across every order.' },
]

const productListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: basmatiVarieties.map((v, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: v.name,
      description: v.blurb,
      category: 'Basmati Rice',
      brand: { '@type': 'Organization', name: company.brandShort },
      url: `${siteUrl}/products/basmati-rice#${v.slug}`,
    },
  })),
}

export default function BasmatiRice() {
  return (
    <>
      <Seo
        title="Basmati Rice Exporter Dubai | 1121, Golden Sella & More"
        description="Basmati rice varieties exported from Dubai — 1121 Steam, 1121 Golden Sella, 1509 Steam, Traditional Steam and Basmati Broken. Wholesale and bulk grades available."
        path="/products/basmati-rice"
      />
      <JsonLd data={productListSchema} />
      <PageHero
        tag="Basmati Rice"
        title="Basmati Rice for Global Markets"
        accent="Global Markets"
        body="Long-grain aromatic rice sourced, checked and prepared for international buyers."
        image="https://images.unsplash.com/photo-1568347355280-d33fdf76e264?q=80&w=1600&auto=format&fit=crop"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: 'Basmati Rice' }]} />

      <section className="bg-sand/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-20">
          <div className="max-w-2xl mb-10">
            <SectionTag>Basmati Rice</SectionTag>
            <h2 className="display-heading text-[clamp(1.7rem,3.2vw,2.6rem)] text-ink mt-5">
              Basmati for <span className="display-accent text-rust">Global Markets</span>
            </h2>
            <p className="text-slate mt-4 leading-relaxed">
              From traditional aromatic grades to long-grain export varieties, our Basmati range
              is sourced and checked with a focus on grain quality, aroma and reliable supply.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl p-6 border border-line/60 bg-ivory"
              >
                <f.icon className="w-5.5 h-5.5 text-gold mb-4" />
                <h3 className="font-display text-lg font-semibold text-ink mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{f.blurb}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <VarietyGrid varieties={basmatiVarieties} />

      <CTASection
        tag="Contact"
        title="Ready to Source?"
        accent="Source?"
        body="Tell us your required variety, grade, packaging and quantity — we'll help you source the right rice."
        primary={{ to: '/contact', label: 'Request a Quote' }}
        secondary={{ to: '/products/non-basmati-rice', label: 'Non-Basmati Rice' }}
      />
    </>
  )
}
