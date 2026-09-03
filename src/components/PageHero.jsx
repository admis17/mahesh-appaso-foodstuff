import { motion } from 'framer-motion'
import SectionTag from './SectionTag'

export default function PageHero({ tag, title, accent, body, image }) {
  const [before, after] = accent ? title.split(accent) : [title, '']

  return (
    <section className="relative bg-deep text-ivory overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/80 to-deep/60" />
      </div>
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-28 sm:pt-36 pb-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionTag light>{tag}</SectionTag>
          <h1 className="display-heading text-[clamp(2.2rem,5.5vw,4rem)] mt-6 mb-6 max-w-3xl text-balance">
            {before}
            {accent && <span className="display-accent text-gold-light">{accent}</span>}
            {after}
          </h1>
          {body && <p className="text-ivory/75 text-base sm:text-lg max-w-xl leading-relaxed">{body}</p>}
        </motion.div>
      </div>
    </section>
  )
}
