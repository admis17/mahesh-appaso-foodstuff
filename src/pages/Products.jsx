import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import PageHero from '../components/PageHero'
import ProductManifest from '../components/ProductManifest'
import CTASection from '../components/CTASection'

export default function Products() {
  return (
    <>
      <Seo
        title="The Manifest — Rice & Pulses | Mahesh Rice Trading"
        description="Explore our rice and pulses range — 1121 Steam, 1509 Steam, 1509 Parboiled, 1121 Golden Sella, 1401 Steam, Sarbati Steam, IR64, Masuri, Sona Masuri, Sambha, Swarna Masoorie, PR11, Lobia, Matar, Kabuli Chana, Rajma, Kala Chana, Chana Dal, Moong and Urad — sourced, checked and delivered worldwide from Dubai. Wholesale and bulk quantities available."
        path="/products"
      />
      <PageHero
        effect="stencil"
        tag="Our Products"
        title="Rice & Pulses, On Record"
        accent="On Record"
        body="Basmati & non-basmati rice and Indian pulses. Sourced, checked and delivered worldwide from Dubai."
        image="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
      <ProductManifest />
      <CTASection
        effect="beam"
        tag="Custom Sourcing"
        title="Looking for a Grade Not Listed Here?"
        accent="Not Listed Here?"
        body="Our mill network covers more grades than this catalogue — send us your specification and target price."
        primary={{ to: '/contact', label: 'Send an Enquiry' }}
        secondary={{ to: '/trade', label: 'Our Services' }}
      />
    </>
  )
}
