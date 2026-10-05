// Builds public/sitemap.xml from the live product catalogue plus the static routes,
// so the sitemap can never go stale when products are added. Run:
//   node scripts/generate-sitemap.mjs
// Keep the domain in sync with src/data/company.js (siteUrl) if a custom domain is connected.
import { writeFileSync } from 'node:fs'
import { products } from '../src/data/products.js'
import { siteUrl } from '../src/data/company.js'

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/products', changefreq: 'weekly', priority: '0.9' },
  { path: '/products/rice', changefreq: 'weekly', priority: '0.9' },
  { path: '/products/pulses', changefreq: 'weekly', priority: '0.9' },
  { path: '/trade', changefreq: 'monthly', priority: '0.7' },
  { path: '/markets', changefreq: 'monthly', priority: '0.6' },
  { path: '/company', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
]

const productRoutes = products
  .filter((p) => p.status === 'active')
  .map((p) => ({ path: `/products/${p.category}/${p.id}`, changefreq: 'monthly', priority: '0.8' }))

const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for (const r of [...staticRoutes.slice(0, 4), ...productRoutes, ...staticRoutes.slice(4)]) {
  xml.push('  <url>', `    <loc>${siteUrl}${r.path}</loc>`, `    <changefreq>${r.changefreq}</changefreq>`, `    <priority>${r.priority}</priority>`, '  </url>')
}
xml.push('</urlset>')

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), `${xml.join('\n')}\n`)
console.log(`sitemap.xml: ${staticRoutes.length + productRoutes.length} urls`)
