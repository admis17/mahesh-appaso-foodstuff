import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import PageHero from '../components/PageHero'
import ProductGrid from '../components/ProductGrid'
import CTASection from '../components/CTASection'

export default function Products() {
  return (
    <>
      <Seo
        title="The Manifest — Rice & Pulses | Mahesh Rice Trading"
        description="Explore our rice and pulses range — IR64, Masuri, Sona Masuri, Lobia, Matar, Kabuli Chana, Rajma, Kala Chana, Chana Dal, Moong and Urad — sourced, checked and delivered worldwide from Dubai. Wholesale and bulk quantities available."
        path="/products"
      />
      <PageHero
        tag="Our Products"
        title="Rice & Pulses, On Record"
        accent="On Record"
        body="Non-basmati rice and Indian pulses. Sourced, checked and delivered worldwide from Dubai."
        image="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
      <ProductGrid showHeading={false} />
      <CTASection
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
