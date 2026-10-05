import { siteUrl } from '../data/company'

// Self-hosted share image — no third-party fetch when links are unfurled.
const DEFAULT_IMAGE = `${siteUrl}/mill-to-market.webp`

// Renders directly into <head> via React 19's native title/meta/link hoisting —
// no extra head-management library needed. Mount once per page/route.
export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE, noindex = false }) {
  const url = `${siteUrl}${path}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Mahesh Rice Trading" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1915" />
      <meta property="og:image:height" content="821" />
      <meta property="og:image:alt" content="MA Foods Stuff premium rice and pulses" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="MA Foods Stuff premium rice and pulses" />
    </>
  )
}
