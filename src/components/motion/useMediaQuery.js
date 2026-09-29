import { useEffect, useState } from 'react'

/** Live boolean for a CSS media query, e.g. useMediaQuery('(min-width: 1024px)'). */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])

  return matches
}

export const LG = '(min-width: 1024px)'
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'
