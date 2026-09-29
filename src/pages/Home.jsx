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
import StoryImage from '../components/StoryImage'
import Scrub from '../components/motion/Scrub'
import GradedBanner from '../components/GradedBanner'
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

      <section className="bg-ivory py-16 sm:py-24 overflow-x-clip">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] gap-12 lg:gap-16 items-center">
            <StoryImage />

            <Scrub from={{ opacity: 0, x: 72 }} offset={['start 90%', 'start 40%']}>
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
            </Scrub>
          </div>
        </div>
      </section>

      <ProductGrid />

      <GradedBanner />

      <StatsBar />
      <ServicesGrid />
      <ProcessSteps />
      <RegionGrid />
      <Testimonials />
      <CTASection />
    </>
  )
}
