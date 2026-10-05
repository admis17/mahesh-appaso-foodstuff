import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import PageHero from '../components/PageHero'
import { company } from '../data/company'

const sections = [
  {
    h: 'What we collect',
    p: 'When you send an enquiry we keep what you type into the form: your name, company, email address, phone number, product interest and message. If you reach us on WhatsApp or by email instead, we keep that conversation so we can answer it.',
  },
  {
    h: 'How we use it',
    p: 'Only to prepare quotations, answer your questions and arrange supply. We do not sell your details, and we do not use them for marketing you did not ask for.',
  },
  {
    h: 'Where it lives',
    p: 'Enquiries are stored in our private database (Supabase, EU region) and are visible only to our team. Pressing "Message on WhatsApp" opens WhatsApp, which applies its own privacy policy to what you send there.',
  },
  {
    h: 'Third parties on this site',
    p: 'This website loads Google Fonts, product photography from Unsplash and an embedded Google Map. Those providers receive your IP address and browser details when the page loads, under their own policies.',
  },
  {
    h: 'Your rights',
    p: 'Ask us any time for a copy of what we hold about you, or to correct or delete it. Write to us and we will act promptly.',
  },
  {
    h: 'Who we are',
    p: `${company.legalNameEn}, ${company.address.line1}, ${company.address.line2}, ${company.address.city}, ${company.address.country}. TRN ${company.trn}. Email ${company.email}.`,
  },
]

export default function Privacy() {
  return (
    <>
      <Seo
        title="Privacy Policy | MA Foods Stuff, Dubai"
        description="How MA Foods Stuff collects, uses and protects enquiry details — and your rights over your data."
        path="/privacy"
      />
      <PageHero
        effect="fill"
        tag="Legal"
        title="Privacy Policy"
        accent="Privacy"
        body="What we collect when you enquire, why we keep it, and your rights over it."
        image="/mill-to-market.webp"
      />
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]} />
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
