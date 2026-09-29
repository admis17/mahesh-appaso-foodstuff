import { useRef } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, Ship, HandCoins, FileCheck2 } from 'lucide-react'
import DrawIcon from './motion/DrawIcon'
import Scrub from './motion/Scrub'
import { useScrub, useSlice } from './motion/useScrub'

const pillars = [
  {
    icon: BadgeCheck,
    title: 'Quality Assured',
    blurb: 'Every consignment checked against agreed specification before it ships.',
  },
  {
    icon: Ship,
    title: 'Global Logistics',
    blurb: 'Import and export documentation, freight and customs handled end-to-end.',
  },
  {
    icon: HandCoins,
    title: 'Competitive Pricing',
    blurb: 'Direct sourcing relationships keep bulk and wholesale pricing sharp.',
  },
  {
    icon: FileCheck2,
    title: 'Trusted Compliance',
    blurb: 'VAT registered and licensed by Dubai Economy and Tourism.',
  },
]

/**
 * One pillar: rises with its own scroll position (so stacked cards on phones each animate as they
 * arrive); a small index offset staggers the desktop row. Its icon draws over the later part.
 */
function Pillar({ pillar: p, index: i }) {
  const ref = useRef(null)
  const progress = useScrub(ref, ['start 98%', 'start 55%'])
  const shift = (i % 4) * 0.08
  const range = [shift, 0.6 + shift]
  const draw = useSlice(progress, [0.3 + shift, 1])
  return (
    <Scrub
      ref={ref}
      progress={progress}
      range={range}
      from={{ opacity: 0, y: 56 }}
      className="relative p-7 rounded-2xl border border-line/60 bg-sand/40 hover:border-gold/50 transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-deep flex items-center justify-center mb-5">
        <DrawIcon icon={p.icon} className="w-5.5 h-5.5 text-gold" progress={draw} />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink mb-2">{p.title}</h3>
      <p className="text-sm text-slate leading-relaxed">{p.blurb}</p>
    </Scrub>
  )
}

export default function TrustPillars() {
  const ref = useRef(null)
  // The linking thread follows the row as a whole.
  const progress = useScrub(ref, ['start 95%', 'start 40%'])
  const thread = useSlice(progress, [0.1, 0.85])

  return (
    <section className="bg-ivory">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-20">
        <div ref={ref} className="relative grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Gold thread linking the pillars at icon height (desktop row only). */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: thread }}
            className="hidden lg:block absolute left-12 right-12 top-[52px] h-px origin-left bg-gradient-to-r from-gold/0 via-gold to-gold/0"
          />
          {pillars.map((p, i) => (
            <Pillar key={p.title} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
