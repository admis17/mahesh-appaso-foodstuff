import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import PageHero from '../components/PageHero'
import ProductGrid from '../components/ProductGrid'
import CTASection from '../components/CTASection'

export default function Products() {
  return (
    <>
      <Seo
        title="Rice Products | Basmati & Non-Basmati | Mahesh Rice Trading"
        description="Explore our Basmati and Non-Basmati rice range — sourced, checked and delivered worldwide from Dubai. Wholesale and bulk quantities available."
        path="/products"
      />
      <PageHero
        tag="Our Products"
        title="Our Rice Range"
        accent="Rice Range"
        body="Premium Basmati and Non-Basmati rice varieties. Sourced, checked and delivered worldwide."
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
        secondary={{ to: '/services', label: 'Our Services' }}
      />
    </>
  )
}
