// Loads the admin-managed content from Supabase and swaps it into the site's data modules
// before the app renders. Components keep importing `products`, `regions`, `company`… as before.
// If Supabase is unreachable or slow, the built-in data in src/data stays in place.
import { supabase } from '../lib/supabase'
import { products } from './products'
import { testimonials } from './testimonials'
import { regions } from './regions'
import { company } from './company'
import { productFromRow, testimonialFromRow, regionFromRow, applySettings } from './mapping'

const replace = (target, rows) => target.splice(0, target.length, ...rows)

export async function loadSiteData({ timeoutMs = 3000 } = {}) {
  const all = Promise.all([
    supabase.from('products').select('*').order('sort').order('entry'),
    supabase.from('testimonials').select('*').order('sort'),
    supabase.from('regions').select('*').order('sort'),
    supabase.from('settings').select('data').eq('id', 1).maybeSingle(),
  ])
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs))
  const res = await Promise.race([all, timeout])
  if (!res) return { source: 'built-in', reason: 'timeout' }

  const [p, t, r, s] = res
  // Each table is applied independently, so one failing query doesn't discard the others.
  if (!p.error && p.data.length) replace(products, p.data.map(productFromRow))
  if (!t.error) replace(testimonials, t.data.map(testimonialFromRow))
  if (!r.error && r.data.length) replace(regions, r.data.map(regionFromRow))
  if (!s.error && s.data) applySettings(company, s.data.data)

  const errors = [p, t, r, s].filter((x) => x.error).map((x) => x.error.message)
  return { source: 'supabase', errors }
}

/** Saves a contact-form enquiry to the admin inbox. Never throws — the visitor's send carries on regardless. */
export async function saveEnquiry(form, channel) {
  const { error } = await supabase.from('enquiries').insert({
    name: form.name.trim(),
    company: form.company_.trim() || null,
    email: form.email.trim(),
    phone: form.phone.trim() || null,
    product: form.product.trim() || null,
    message: form.message.trim(),
    channel,
    page: window.location.pathname,
  })
  if (error) console.warn('Enquiry not saved to inbox:', error.message)
  return !error
}
