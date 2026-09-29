import { motion } from 'framer-motion'
import { Plane, Ship, FileCheck2 } from 'lucide-react'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import RegionGrid from '../components/RegionGrid'
import StatsBar from '../components/StatsBar'
import SectionTag from '../components/SectionTag'
import CTASection from '../components/CTASection'

const routes = [
  {
    icon: Ship,
    title: 'Sea Freight',
    blurb: 'FCL and LCL container shipments routed through Jebel Ali and regional ports.',
  },
  {
    icon: Plane,
    title: 'Air Freight',
    blurb: 'Time-sensitive consignments moved through Dubai’s air cargo hubs.',
  },
  {
    icon: FileCheck2,
    title: 'Customs & Compliance',
    blurb: 'Export documentation, certificates of origin and customs clearance handled in-house.',
  },
]

export default function GlobalReach() {
  return (
    <>
      <Seo
        title="Global Reach | Rice Exports to 6 Regions | Mahesh Rice Trading"
        description="Rice exported from Dubai to the GCC, East & North Africa, South Asia, Southeast Asia, Europe and the USA & Canada — sea and air freight with full export documentation."
        path="/markets"
      />
      <PageHero
        tag="Global Reach"
        title="A Rice Trade Network Spanning Six Regions"
        accent="Six Regions"
        body="Based in Dubai, positioned at the crossroads of the GCC, Africa, Asia, Europe and the Americas."
        image="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop"
      />

      <RegionGrid />
      <StatsBar />

      <section className="bg-ivory py-16 sm:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-12">
            <SectionTag>How Goods Move</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
              Routed Through <span className="display-accent text-rust">Dubai&apos;s Trade Corridors</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-7">
            {routes.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-8 border border-line/60 bg-sand/40"
              >
                <div className="w-12 h-12 rounded-full bg-deep flex items-center justify-center mb-6">
                  <r.icon className="w-5.5 h-5.5 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{r.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{r.blurb}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        tag="Expand With Us"
        title="Looking to Import Into a New Market?"
        accent="Into a New Market?"
        body="Share your target region and rice grade — we'll map out the fastest route to get there."
      />
    </>
  )
}
