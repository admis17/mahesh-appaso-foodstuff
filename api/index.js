// Vercel serverless backend — same endpoints as server/index.js, without express
// (only @supabase/supabase-js, already a root dependency). Needs SUPABASE_URL
// and SUPABASE_SERVICE_KEY in Vercel → Project → Settings → Environment Variables.
import { createClient } from '@supabase/supabase-js'

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://mahesh-appaso-foodstuff.vercel.app')
  .split(',')
  .map((s) => s.trim())

let _supabase = null
function sb() {
  if (_supabase) return _supabase
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (url && key) _supabase = createClient(url, key)
  return _supabase
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cors(req, res) {
  const origin = req.headers.origin
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  cors(req, res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const url = new URL(req.url, 'http://localhost')
  const path = url.pathname.replace(/\/$/, '') || '/'

  if (req.method === 'GET' && path === '/api/health') {
    return res.json({ status: 'ok', supabase: !!sb() })
  }

  if (req.method === 'POST' && path === '/api/enquiries') {
    if (req.body?.website) return res.json({ success: true })
    const { name, company, email, phone, product, message, channel, page } = req.body || {}
    if (!String(name ?? '').trim()) return res.status(400).json({ error: 'Name is required.' })
    if (!EMAIL.test(String(email ?? '').trim())) return res.status(400).json({ error: 'A valid email is required.' })
    if (!String(message ?? '').trim()) return res.status(400).json({ error: 'Message is required.' })
    if (channel && !['whatsapp', 'email'].includes(channel)) {
      return res.status(400).json({ error: 'Unknown channel.' })
    }
    const db = sb()
    if (db) {
      const { error } = await db.from('enquiries').insert({
        name: String(name).trim().slice(0, 120),
        company: String(company ?? '').trim().slice(0, 160) || null,
        email: String(email).trim().toLowerCase().slice(0, 200),
        phone: String(phone ?? '').trim().slice(0, 40) || null,
        product: String(product ?? '').trim().slice(0, 200) || null,
        message: String(message).trim().slice(0, 4000),
        channel: channel ?? null,
        page: String(page ?? '').trim().slice(0, 200) || null,
      })
      if (error) return res.status(500).json({ error: 'Failed to save enquiry.' })
    }
    return res.json({ success: true, message: 'Enquiry received. We will get back to you shortly.' })
  }

  const db = sb()
  if (req.method === 'GET' && path === '/api/cms/products') {
    if (!db) return res.json({ products: [] })
    const { data } = await db.from('products').select('*').eq('status', 'active').order('sort').order('entry')
    return res.json({ products: data || [] })
  }
  if (req.method === 'GET' && path === '/api/cms/testimonials') {
    if (!db) return res.json({ testimonials: [] })
    const { data } = await db.from('testimonials').select('*').order('sort')
    return res.json({ testimonials: data || [] })
  }
  if (req.method === 'GET' && path === '/api/cms/regions') {
    if (!db) return res.json({ regions: [] })
    const { data } = await db.from('regions').select('*').order('sort')
    return res.json({ regions: data || [] })
  }
  if (req.method === 'GET' && path === '/api/cms/settings') {
    if (!db) return res.json({})
    const { data } = await db.from('settings').select('data').eq('id', 1).maybeSingle()
    return res.json(data?.data || {})
  }

  return res.status(404).json({ error: 'Not found.' })
}
