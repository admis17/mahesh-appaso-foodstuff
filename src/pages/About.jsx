import { motion } from 'framer-motion'
import { Target, Eye, HeartHandshake, ShieldCheck, Building2, FileBadge2 } from 'lucide-react'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import SectionTag from '../components/SectionTag'
import CTASection from '../components/CTASection'
import { company } from '../data/company'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    blurb: 'Move quality rice and pulses from origin to buyer efficiently, with clean paperwork and no surprises.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    blurb: 'To be a dependable Dubai-based rice trade partner for buyers across the GCC, Africa, Asia, Europe and the Americas.',
  },
  {
    icon: HeartHandshake,
    title: 'Our Approach',
    blurb: 'Direct relationships with mills and buyers, transparent pricing, and consistent communication.',
  },
]

const credentials = [
  {
    icon: ShieldCheck,
    label: 'Tax Registration Number',
    value: company.trn,
  },
  {
    icon: FileBadge2,
    label: 'Trade License Number',
    value: company.license.number,
  },
  {
    icon: Building2,
    label: 'Licensing Authority',
    value: company.license.authority,
  },
]

export default function About() {
  return (
    <>
      <Seo
        title="About Us | Mahesh Rice Trading, Dubai"
        description="Mahesh Appaso Foodstuff Trading L.L.C is a Dubai-based rice and pulses trading house, licensed by Dubai Economy and Tourism and VAT registered with the UAE FTA."
        path="/company"
      />
      <PageHero
        tag="About Us"
        title="Built on Trust, Trading Across Borders"
        accent="Trading Across Borders"
        body="A Dubai-based rice & pulses trading house connecting origin mills with buyers across the GCC, Africa, Asia, Europe and the Americas."
        image="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1600&auto=format&fit=crop"
      />

      <section className="bg-ivory py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
            >
              <SectionTag>Our Story</SectionTag>
              <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5 mb-7">
                From Ras Al Khor to <span className="display-accent text-rust">Global Markets</span>
              </h2>
              <div className="space-y-5 text-slate text-base sm:text-lg leading-relaxed">
                <p>
                  {company.legalNameEn} operates out of Ras Al Khor Industrial, one of Dubai&apos;s
                  established trade and logistics districts, minutes from the emirate&apos;s port
                  and airport infrastructure.
                </p>
                <p>
                  We trade rice and pulses — nothing else on the books: raw sortexed and steam
                  non-basmati rice, whole and split pulses — matching origin mills to the
                  specifications and volumes our buyers need.
                </p>
                <p>
                  Every shipment moves with proper documentation: certificates of origin, invoicing
                  aligned to UAE VAT requirements, and customs paperwork handled in-house so buyers
                  face fewer delays at their end.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="rounded-2xl overflow-hidden aspect-[4/5]"
            >
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop"
                alt="Dubai warehouse and logistics district"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-sand/50 py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-12">
            <SectionTag>What Drives Us</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
              Mission, Vision &amp; <span className="display-accent text-rust">Approach</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-7">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-ivory rounded-2xl p-8 border border-line/60"
              >
                <div className="w-12 h-12 rounded-full bg-deep flex items-center justify-center mb-6">
                  <v.icon className="w-5.5 h-5.5 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{v.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{v.blurb}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-deep text-ivory py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-12">
            <SectionTag light>Registered &amp; Compliant</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] mt-5">
              Licensed to Trade in <span className="display-accent text-gold-light">Dubai, UAE</span>
            </h2>
            <p className="text-ivory/70 mt-5 leading-relaxed">
              {company.legalNameEn} is registered for VAT with the UAE Federal Tax Authority and
              licensed by {company.license.authority}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-7">
            {credentials.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-7 border border-ivory/15 bg-ivory/5"
              >
                <c.icon className="w-6 h-6 text-gold mb-4" />
                <p className="eyebrow text-ivory/50 mb-2">{c.label}</p>
                <p className="font-display text-lg sm:text-xl font-semibold text-ivory break-words">{c.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        tag="Let's Work Together"
        title="Have a Sourcing Need in Mind?"
        accent="in Mind?"
        body="Tell us the rice grade, quantity and destination — we'll come back with a workable quote."
      />
    </>
  )
}
