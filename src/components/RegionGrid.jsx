import { useRef } from 'react'
import { Globe2 } from 'lucide-react'
import { regions } from '../data/regions'
import SectionTag from './SectionTag'
import RouteMap from './RouteMap'
import Scrub from './motion/Scrub'
import ScrubText from './motion/ScrubText'
import { useScrub, useSlice } from './motion/useScrub'

/** Region card: rises with scroll while its country list types in, and un-types on the way back up. */
function RegionCard({ region, index }) {
  const ref = useRef(null)
  const progress = useScrub(ref, ['start 98%', 'start 50%'])
  const column = (index % 3) * 0.1
  const typed = useSlice(progress, [0.3 + column, 1])

  return (
    <Scrub
      ref={ref}
      progress={progress}
      range={[column, 0.55 + column]}
      from={{ opacity: 0, y: 44 }}
      className="bg-ivory rounded-2xl p-7 sm:p-8 border border-line/60 flex items-start gap-5"
    >
      <div className="w-12 h-12 rounded-full bg-deep flex items-center justify-center shrink-0">
        <Globe2 className="w-5.5 h-5.5 text-gold" />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-xl font-semibold text-ink mb-2">{region.name}</h3>
        <ScrubText progress={typed} text={region.countries} className="text-sm text-slate leading-relaxed" />
      </div>
    </Scrub>
  )
}

export default function RegionGrid({ showHeading = true }) {
  return (
    <section className="relative bg-sand/50 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
        {showHeading && (
          <Scrub from={{ opacity: 0, y: 40 }} className="max-w-2xl mb-12">
            <SectionTag>Global Reach</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
              Rice Exports Across <span className="display-accent text-rust">Six Regions</span>
            </h2>
          </Scrub>
        )}

        <div className="mb-12 rounded-3xl border border-line/60 bg-ivory/70 px-3 py-6 sm:px-8 sm:py-8">
          <RouteMap routes={regions} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((r, i) => (
            <RegionCard key={r.name} region={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
