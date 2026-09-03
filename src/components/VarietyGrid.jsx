import { motion } from 'framer-motion'
import Button from './Button'
import SectionTag from './SectionTag'

const specLabels = {
  processing: 'Processing',
  moisture: 'Moisture',
  grainLength: 'Grain Length',
  broken: 'Broken',
  grades: 'Grades',
  quality: 'Quality',
  packaging: 'Packaging',
}

export default function VarietyGrid({ varieties }) {
  return (
    <>
      {/* Quick-jump strip */}
      <section className="bg-sand/50 border-b border-line/60">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <div className="flex flex-wrap gap-3">
            {varieties.map((v, i) => (
              <a
                key={v.slug}
                href={`#${v.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-ivory text-xs font-semibold uppercase tracking-wide text-ink hover:border-gold hover:text-gold transition-colors"
              >
                <span className="text-gold">{String(i + 1).padStart(2, '0')}</span>
                {v.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed catalogue */}
      <section className="bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-24">
          <div className="max-w-2xl mb-12">
            <SectionTag>Catalogue</SectionTag>
            <h2 className="display-heading text-[clamp(1.9rem,3.6vw,3rem)] text-ink mt-5">
              Explore the <span className="display-accent text-rust">Full Range</span>
            </h2>
          </div>

          <div className="space-y-6">
            {varieties.map((v, i) => (
              <motion.div
                key={v.slug}
                id={v.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className="rounded-2xl border border-line/60 bg-sand/30 p-7 sm:p-9 scroll-mt-28"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-display text-2xl text-gold/50">{String(i + 1).padStart(2, '0')}</span>
                      <span className="eyebrow px-3 py-1 rounded-full bg-deep text-gold-light">{v.tag}</span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-ink mb-3">{v.name}</h3>
                    <p className="text-slate leading-relaxed max-w-xl mb-6">{v.blurb}</p>
                    <Button to="/contact" variant="deep" size="sm">Request a Quote</Button>
                  </div>

                  <div className="lg:w-64 shrink-0">
                    <p className="eyebrow text-slate mb-4">Specifications</p>
                    <dl className="grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-3">
                      {Object.entries(v.specs).map(([key, value]) => (
                        <div key={key} className="border-t border-line/60 pt-2">
                          <dt className="text-[11px] uppercase tracking-wide text-slate/80">{specLabels[key] || key}</dt>
                          <dd className="text-sm font-semibold text-ink">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
