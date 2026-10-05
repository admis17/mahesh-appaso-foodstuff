import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import PageHero from '../components/PageHero'
import { company } from '../data/company'

const sections = [
  {
    h: 'Enquiries, not orders',
    p: 'Everything on this website — grades, specifications and availability — is an invitation to enquire, not an offer to sell. A sale happens only when both sides confirm a written quotation or contract.',
  },
  {
    h: 'Prices and availability',
    p: 'Rice and pulse prices move with origin markets, freight and currency. Prices are confirmed per enquiry and are valid for the period stated on the quotation.',
  },
  {
    h: 'Specifications',
    p: 'Grades shown (broken percentages, grain lengths, moisture) are typical export specifications. The binding specification is the one on your confirmed contract, verified against pre-shipment inspection where agreed.',
  },
  {
    h: 'Website content',
    p: 'Product descriptions, photography and trade records on this site belong to us. You may share links to our pages; please do not copy our content onto other websites without permission.',
  },
  {
    h: 'Liability',
    p: 'We work to keep this site accurate and available, but we do not warrant that it is error-free or uninterrupted. Nothing here limits liability that cannot be limited by law.',
  },
  {
    h: 'Governing law',
    p: 'These terms are governed by the laws of the United Arab Emirates, and disputes are subject to the courts of Dubai.',
  },
  {
    h: 'Contact',
    p: `${company.legalNameEn}, ${company.address.line1}, ${company.address.line2}, ${company.address.city}, ${company.address.country}. Email ${company.email}.`,
  },
]

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms of Use | MA Foods Stuff, Dubai"
        description="Terms for using the MA Foods Stuff website and enquiring about rice and pulses."
        path="/terms"
      />
      <PageHero
        effect="fill"
        tag="Legal"
        title="Terms of Use"
        accent="Terms"
        body="The ground rules for this website and for enquiring with us."
        image="/mill-to-market.webp"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms of Use' }]} />
      <section className="bg-ivory">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-16 sm:py-24 space-y-10">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-2xl font-semibold text-ink mb-3">{s.h}</h2>
              <p className="text-ink/80 leading-relaxed">{s.p}</p>
            </div>
          ))}
          <p className="text-sm text-slate">Last updated: October 2026.</p>
        </div>
      </section>
    </>
  )
}
