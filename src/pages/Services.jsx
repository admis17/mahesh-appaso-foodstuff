import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import ServicesRail from '../components/ServicesRail'
import ProcessStack from '../components/ProcessStack'
import CTASection from '../components/CTASection'

export default function Services() {
  return (
    <>
      <Seo
        title="Rice Trade Services | Import, Export & Sourcing | Mahesh Rice Trading"
        description="Rice import, export, wholesale supply, sourcing, private labeling and logistics services from Dubai — handled end-to-end for GCC, Africa, Asia, Europe and Americas buyers."
        path="/trade"
      />
      <PageHero
        effect="fill"
        tag="Our Services"
        title="Rice Trade Services Built Around Your Supply Chain"
        accent="Your Supply Chain"
        body="Import, export, sourcing, packaging and logistics — handled under one roof so you deal with fewer parties."
        image="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=1600&auto=format&fit=crop"
      />
      <ServicesRail />
      <ProcessStack />
      <CTASection
        effect="lines"
        tag="Talk to Us"
        title="Need a Service Not Listed Here?"
        accent="Not Listed Here?"
        body="Tell us what your rice supply chain needs and we'll let you know how we can help."
      />
    </>
  )
}
