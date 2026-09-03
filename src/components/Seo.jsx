import { siteUrl } from '../data/company'

// Placeholder social-share image — swap for real product photography once
// the client's photo shoot (see chat history) is ready, then self-host it
// under /public and point this at `${siteUrl}/og-image.jpg` instead.
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop'

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

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
