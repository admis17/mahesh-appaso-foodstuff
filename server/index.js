import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { getSupabase } from './lib/supabase.js'

const app = express()
const PORT = process.env.PORT || 5000

// ─── CORS ───
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}))
app.use(express.json())

// ─── Health check ───
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', supabase: !!getSupabase() })
})

// ─── Enquiry intake (mirrors the site's contact form + saveEnquiry shape) ───
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.post('/api/enquiries', async (req, res) => {
  // Spam trap: bots fill the hidden "website" field — accept quietly, save nothing.
  if (req.body.website) return res.json({ success: true })

  const { name, company, email, phone, product, message, channel, page } = req.body

  if (!String(name ?? '').trim()) return res.status(400).json({ error: 'Name is required.' })
  if (!EMAIL.test(String(email ?? '').trim())) return res.status(400).json({ error: 'A valid email is required.' })
  if (!String(message ?? '').trim()) return res.status(400).json({ error: 'Message is required.' })
  if (channel && !['whatsapp', 'email'].includes(channel)) {
    return res.status(400).json({ error: 'Unknown channel.' })
  }

  const record = {
    name: String(name).trim().slice(0, 120),
    company: String(company ?? '').trim().slice(0, 160) || null,
    email: String(email).trim().toLowerCase().slice(0, 200),
    phone: String(phone ?? '').trim().slice(0, 40) || null,
    product: String(product ?? '').trim().slice(0, 200) || null,
    message: String(message).trim().slice(0, 4000),
    channel: channel ?? null,
    page: String(page ?? '').trim().slice(0, 200) || null,
  }

  const sb = getSupabase()
  if (sb) {
    const { error } = await sb.from('enquiries').insert(record)
    if (error) {
      console.error('[Enquiries] Supabase error:', error.message)
      return res.status(500).json({ error: 'Failed to save enquiry.' })
    }
  } else {
    console.log('[Enquiries] (no Supabase — console only)', record)
  }

  res.json({ success: true, message: 'Enquiry received. We will get back to you shortly.' })
})

// ─── Public catalogue reads (same rows the site shows) ───
app.get('/api/cms/products', async (_req, res) => {
  const sb = getSupabase()
  if (!sb) return res.json({ products: [] })
  const { data } = await sb.from('products').select('*').eq('status', 'active').order('sort').order('entry')
  res.json({ products: data || [] })
})

app.get('/api/cms/testimonials', async (_req, res) => {
  const sb = getSupabase()
  if (!sb) return res.json({ testimonials: [] })
  const { data } = await sb.from('testimonials').select('*').order('sort')
  res.json({ testimonials: data || [] })
})

app.get('/api/cms/regions', async (_req, res) => {
  const sb = getSupabase()
  if (!sb) return res.json({ regions: [] })
  const { data } = await sb.from('regions').select('*').order('sort')
  res.json({ regions: data || [] })
})

app.get('/api/cms/settings', async (_req, res) => {
  const sb = getSupabase()
  if (!sb) return res.json({})
  const { data } = await sb.from('settings').select('data').eq('id', 1).maybeSingle()
  res.json(data?.data || {})
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Supabase: ${getSupabase() ? 'connected' : 'NOT configured (console only)'}`)
})
