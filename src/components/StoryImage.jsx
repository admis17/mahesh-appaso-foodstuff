import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrub, useSlice } from './motion/useScrub'

/**
 * Home "About Us" photo, driven by scroll: the photo wipes open, drifts slower than the page,
 * and the licence badge stamps down near the end. All of it rewinds when scrolling back up.
 */
export default function StoryImage() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  const progress = useScrub(ref, ['start 90%', 'start 25%'])
  const wipe = useSlice(progress, [0, 0.7])
  const clipPath = useTransform(wipe, (t) => `inset(0% ${(1 - t) * 100}% 0% 0% round 16px)`)
  const stamp = useSlice(progress, [0.65, 1])
  const badgeOpacity = useTransform(stamp, [0, 0.4], [0, 1])
  const badgeScale = useTransform(stamp, [0, 1], [1.7, 1])
  const badgeRotate = useTransform(stamp, [0, 1], [-14, -3])

  return (
    <div ref={ref} className="relative">
      <motion.div className="w-full aspect-[4/5] max-h-[70vh] rounded-2xl overflow-hidden bg-deep/10" style={{ clipPath }}>
        <motion.img
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop"
          alt="Warehouse stock of packaged foodstuff ready for export"
          className="w-full h-full object-cover scale-[1.16]"
          style={{ y }}
          loading="lazy"
        />
      </motion.div>
      <motion.div
        className="absolute -bottom-6 -left-6 sm:bottom-6 sm:left-6 bg-gold rounded-2xl text-deep px-7 py-5 shadow-xl"
        style={{ opacity: badgeOpacity, scale: badgeScale, rotate: badgeRotate }}
      >
        <p className="font-display text-3xl sm:text-4xl font-bold leading-none">UAE</p>
        <p className="text-xs font-semibold uppercase tracking-wider mt-1.5">Licensed &amp; VAT Registered</p>
      </motion.div>
    </div>
  )
}
