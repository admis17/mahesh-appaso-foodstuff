import { useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

/*
 * Scroll-scrubbed motion for the home page: instead of playing once when a section appears,
 * effects track the scroll position — scroll slowly and they move slowly, stop and they hold,
 * scroll back up and they rewind.
 */

// Element enters near the bottom of the screen → finishes a little above the middle.
export const ENTER = ['start 95%', 'start 50%']

/**
 * 0→1 progress for `ref` across `offset`, lightly spring-smoothed so wheel steps don't jitter.
 * Reduced motion: a constant 1, so everything renders in its finished state.
 */
export function useScrub(ref, offset = ENTER) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset })
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 32, restDelta: 0.0005 })
  const done = useMotionValue(1)
  return reduce ? done : smooth
}

/** Maps a slice of `progress` onto 0→1 (clamped). Use to stagger items along one progress value. */
export function useSlice(progress, range = [0, 1]) {
  return useTransform(progress, range, [0, 1], { clamp: true })
}
