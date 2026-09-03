import { motion } from 'framer-motion'
import { Search, Settings2, PackageCheck } from 'lucide-react'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import JsonLd from '../components/JsonLd'
import PageHero from '../components/PageHero'
import SectionTag from '../components/SectionTag'
import VarietyGrid from '../components/VarietyGrid'
import CTASection from '../components/CTASection'
import { nonBasmatiVarieties } from '../data/products'
import { company, siteUrl } from '../data/company'

const features = [
  { icon: Search, title: 'Carefully Sourced', blurb: 'Vetted origin mills for every grade.' },
  { icon: Settings2, title: 'Precision Processed', blurb: 'Sortex sorting and grading on request.' },
  { icon: PackageCheck, title: 'Export Ready', blurb: 'Prepared for international markets.' },
]

const productListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: nonBasmatiVarieties.map((v, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: v.name,
      description: v.blurb,
      category: 'Non-Basmati Rice',
      brand: { '@type': 'Organization', name: company.brandShort },
      url: `${siteUrl}/products/non-basmati-rice#${v.slug}`,
    },
  })),
}

export default function NonBasmatiRice() {
  return (
    <>
      <Seo
        title="Non-Basmati Rice Supplier Dubai | IR64, Sona Masuri, Swarna"
        description="Non-Basmati rice varieties exported from Dubai — IR64 Raw Sortex, Sona Masuri Steam, Swarna Steam, PR11 Sella and 100% Raw Broken. Wholesale and bulk grades available."
        path="/products/non-basmati-rice"
      />
      <JsonLd data={productListSchema} />
      <PageHero
        tag="Non-Basmati Rice"
        title="Non-Basmati Rice for Global Markets"
        accent="Global Markets"
        body="A broad range of non-basmati grades, sourced and checked for wholesale and bulk buyers."
        image="https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1600&auto=format&fit=crop"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: 'Non-Basmati Rice' }]} />

      <section className="bg-sand/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-20">
          <div className="max-w-2xl mb-10">
            <SectionTag>Non-Basmati Rice</SectionTag>
            <h2 className="display-heading text-[clamp(1.7rem,3.2vw,2.6rem)] text-ink mt-5">
              A Broad Range for <span className="display-accent text-rust">Every Market</span>
            </h2>
            <p className="text-slate mt-4 leading-relaxed">
              Including IR64, Sona Masuri, Swarna and more — sourced, sorted and checked to meet
              the requirements of international buyers, available in multiple broken-grain grades.
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

      <VarietyGrid varieties={nonBasmatiVarieties} />

      <CTASection
        tag="Contact"
        title="Ready to Source?"
        accent="Source?"
        body="Tell us your required variety, grade, packaging and quantity — we'll help you source the right rice."
        primary={{ to: '/contact', label: 'Request a Quote' }}
        secondary={{ to: '/products/basmati-rice', label: 'Basmati Rice' }}
      />
    </>
  )
}
