import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import Hero from '../components/Hero'
import TrustPillars from '../components/TrustPillars'
import SectionTag from '../components/SectionTag'
import Button from '../components/Button'
import ProductGrid from '../components/ProductGrid'
import ServicesGrid from '../components/ServicesGrid'
import StatsBar from '../components/StatsBar'
import ProcessSteps from '../components/ProcessSteps'
import RegionGrid from '../components/RegionGrid'
import Testimonials from '../components/Testimonials'
import CTASection from '../components/CTASection'
import { company } from '../data/company'

export default function Home() {
  return (
    <>
      <Seo
        title="Mahesh Rice Trading | Rice & Pulses Trader, Dubai"
        description="Dubai-based trader of Indian rice and pulses. Wholesale and bulk supply to buyers across the GCC, Africa, Asia, Europe and the Americas."
        path="/"
      />
      <Hero />
      <TrustPillars />

      <section className="bg-ivory py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(10% 0% 10% 0%)' }}
              whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="w-full aspect-[4/5] max-h-[70vh] rounded-2xl overflow-hidden bg-deep/10">
                <img
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop"
                  alt="Warehouse stock of packaged foodstuff ready for export"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:left-6 bg-gold rounded-2xl text-deep px-7 py-5 shadow-xl">
                <p className="font-display text-3xl sm:text-4xl font-bold leading-none">UAE</p>
                <p className="text-xs font-semibold uppercase tracking-wider mt-1.5">Licensed &amp; VAT Registered</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionTag>About Us</SectionTag>
              <h2 className="display-heading text-[clamp(2rem,4vw,3.2rem)] text-ink mt-5 mb-7">
                Dubai&apos;s Rising Name in <span className="display-accent text-rust">Rice Trade</span>
              </h2>
              <div className="space-y-5 text-slate text-base sm:text-lg leading-relaxed">
                <p>
                  {company.legalNameEn} operates out of Ras Al Khor Industrial, one of Dubai&apos;s
                  key trade and logistics hubs.
                </p>
                <p>
                  We connect Indian rice mills and pulse processors with wholesale buyers,
                  distributors and retailers across the GCC, Africa, Asia, Europe and the
                  Americas — backed by clean documentation and a valid FTA tax registration.
                </p>
              </div>
              <div className="mt-8">
                <Button to="/company" variant="deep">Our Full Story</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ProductGrid />

      <section className="relative overflow-hidden">
        <div className="h-[50vh] sm:h-[60vh] relative">
          <img
            src="https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1800&auto=format&fit=crop"
            alt="Raw rice grains graded for export quality"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-10 sm:pb-14 w-full">
              <p className="eyebrow text-gold-light mb-3">From Mill to Market</p>
              <h2 className="display-heading text-[clamp(1.7rem,3.2vw,2.6rem)] text-ivory max-w-xl">
                Every Grade Graded and Packed to Export Standard
              </h2>
            </div>
          </div>
        </div>
      </section>

      <StatsBar />
      <ServicesGrid />
      <ProcessSteps />
      <RegionGrid />
      <Testimonials />
      <CTASection />
    </>
  )
}
