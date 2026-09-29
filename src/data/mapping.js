// Converts between Supabase rows (snake_case columns) and the shapes the site already uses.
// Shared by the site's data loader, the admin app and scripts/generate-seed.mjs.

export const productFromRow = (r) => ({
  id: r.id,
  entry: r.entry,
  name: r.name,
  shortName: r.short_name,
  category: r.category,
  subcategory: r.subcategory,
  origin: r.origin,
  processing: r.processing,
  specs: r.specs ?? [],
  packaging: r.packaging ?? [],
  markets: r.markets ?? [],
  status: r.status,
  verification: r.verification,
})

export const productToRow = (p) => ({
  id: p.id,
  entry: p.entry,
  name: p.name,
  short_name: p.shortName,
  category: p.category,
  subcategory: p.subcategory,
  origin: p.origin,
  processing: p.processing,
  specs: p.specs,
  packaging: p.packaging,
  markets: p.markets,
  status: p.status,
  verification: p.verification,
  sort: p.sort ?? 0,
})

export const testimonialFromRow = (r) => ({ id: r.id, name: r.name, location: r.location, quote: r.quote })

export const regionFromRow = (r) => ({
  id: r.id,
  name: r.name,
  countries: r.countries,
  coords: [r.lon, r.lat],
  ...(r.map_label === 'below' ? { mapLabel: 'below' } : {}),
})

// The editable subset of company details (legal name, brand and licence authority stay in code).
export const settingsFromCompany = (c) => ({
  email: c.email,
  phone: c.phoneHref,
  whatsapp: c.whatsapp,
  hours: c.hours,
  address: { ...c.address },
  social: { ...c.social },
  mapEmbedSrc: c.mapEmbedSrc,
  licenseNumber: c.license.number,
  trn: c.trn,
})

/** Writes saved settings onto the company object in place, ignoring blank values. */
export function applySettings(c, s = {}) {
  const set = (key, value) => {
    if (typeof value === 'string' && value.trim()) c[key] = value.trim()
  }
  set('email', s.email)
  set('phoneHref', s.phone)
  set('whatsapp', s.whatsapp?.replace(/[^\d]/g, ''))
  set('hours', s.hours)
  set('mapEmbedSrc', s.mapEmbedSrc)
  set('trn', s.trn)
  if (s.licenseNumber?.trim()) c.license.number = s.licenseNumber.trim()
  for (const k of ['line1', 'line2', 'city', 'country']) if (s.address?.[k]?.trim()) c.address[k] = s.address[k].trim()
  for (const k of ['instagram', 'linkedin', 'facebook']) if (s.social?.[k]?.trim()) c.social[k] = s.social[k].trim()
}
