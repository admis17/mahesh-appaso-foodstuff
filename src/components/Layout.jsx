import { MotionConfig } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import PageTransition from './PageTransition'
import JsonLd from './JsonLd'
import { company, siteUrl } from '../data/company'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.brandShort,
  legalName: company.legalNameEn,
  url: siteUrl,
  email: company.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${company.address.line1}, ${company.address.line2}`,
    addressLocality: company.address.city,
    addressCountry: 'AE',
  },
  taxID: company.trn,
  sameAs: [company.social.instagram, company.social.linkedin, company.social.facebook],
}

export default function Layout() {
  return (
    // reducedMotion="user": framer skips transform/layout animation for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-ivory">
        <JsonLd data={organizationSchema} />
        <Header />
        <main className="flex-1">
          <PageTransition />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </MotionConfig>
  )
}
