// In-browser stand-in for the Supabase client, used only by the admin's "Preview with sample
// data" mode. It supports exactly the calls the admin makes (select / insert / update / upsert /
// delete with eq, gte, order, limit, single, maybeSingle, head counts, and the auth methods),
// keeps everything in memory, and forgets it all on reload. Nothing is sent anywhere.
import { products } from '../data/products'
import { testimonials } from '../data/testimonials'
import { regions } from '../data/regions'
import { company } from '../data/company'
import { productToRow, settingsFromCompany } from '../data/mapping'

const DEMO_USER = { id: 'demo-admin', email: 'demo@maheshricetrading.com' }
const iso = (minutesAgo) => new Date(Date.now() - minutesAgo * 60000).toISOString()
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2))

function sampleData() {
  return {
    products: products.map((p, i) => ({ ...productToRow({ ...p, sort: i }), updated_at: iso(0) })),
    testimonials: testimonials.map((t, i) => ({ id: uid(), ...t, published: true, sort: i, updated_at: iso(0) })),
    regions: regions.map((r, i) => ({
      id: uid(), name: r.name, countries: r.countries, lon: r.coords[0], lat: r.coords[1],
      map_label: r.mapLabel ?? 'above', sort: i, updated_at: iso(0),
    })),
    settings: [{ id: 1, data: settingsFromCompany(company), updated_at: iso(0) }],
    admins: [{ user_id: DEMO_USER.id, email: DEMO_USER.email }],
    // Invented example leads so every inbox state has something in it.
    enquiries: [
      { name: 'Amina Yusuf', company: 'Lagos Foods Ltd', email: 'amina@lagosfoods.example', phone: '+234 803 555 0101', product: 'Silky Sortex Raw IR64 — 10% broken', message: '2 × 20ft containers to Lagos, CIF. Can you share this month’s price and loading date?', channel: 'whatsapp', status: 'new', notes: null, mins: 35 },
      { name: 'Hassan Al Farsi', company: 'Muscat Wholesale Trading', email: 'hassan@muscatwholesale.example', phone: '+968 9123 4567', product: 'Kabuli Chana', message: 'Looking for 40 MT, 12mm size, packed in 25 kg bags. Delivery Sohar port.', channel: 'email', status: 'new', notes: null, mins: 180 },
      { name: 'Priya Raman', company: 'Colombo Staples', email: 'priya@colombostaples.example', phone: '+94 77 123 4567', product: 'Steam Sona Masuri', message: 'Trial order of 1 container, then monthly if quality is consistent.', channel: 'whatsapp', status: 'contacted', notes: 'Spoke on WhatsApp — wants samples first. Courier on Monday.', mins: 1440 },
      { name: 'Joseph Mwangi', company: 'Nairobi Grain Co.', email: 'joseph@nairobigrain.example', phone: '+254 712 345 678', product: 'Silky Sortex Raw Masuri — 5% broken', message: 'Price for 100 MT CIF Mombasa please.', channel: 'email', status: 'quoted', notes: 'Quoted CIF Mombasa, valid 7 days.', mins: 2880 },
      { name: 'Daniel Okafor', company: 'Abuja Retail Group', email: 'daniel@abujaretail.example', phone: '+234 809 222 3344', product: 'Rajma', message: 'Confirmed — please send the proforma invoice.', channel: 'email', status: 'won', notes: 'PI sent, advance received.', mins: 7200 },
      { name: 'Test Bot', company: null, email: 'bot@spam.example', phone: null, product: null, message: 'Cheap SEO services!!!', channel: 'email', status: 'spam', notes: null, mins: 9000 },
    ].map(({ mins, ...e }) => ({ id: uid(), created_at: iso(mins), updated_at: iso(mins), page: '/contact', ...e })),
  }
}

class Query {
  constructor(store, table) {
    Object.assign(this, { store, table, op: 'select', filters: [], orders: [], lim: null, mode: 'many', head: false, payload: null, returning: false })
  }
  select(_cols, opts = {}) {
    if (this.op === 'select') this.head = Boolean(opts.head)
    else this.returning = true
    return this
  }
  insert(rows) { return Object.assign(this, { op: 'insert', payload: rows }) }
  upsert(rows) { return Object.assign(this, { op: 'upsert', payload: rows }) }
  update(patch) { return Object.assign(this, { op: 'update', payload: patch }) }
  delete() { return Object.assign(this, { op: 'delete' }) }
  eq(col, val) { this.filters.push((r) => String(r[col]) === String(val)); return this }
  gte(col, val) { this.filters.push((r) => r[col] >= val); return this }
  order(col, { ascending = true } = {}) { this.orders.push([col, ascending]); return this }
  limit(n) { this.lim = n; return this }
  single() { this.mode = 'single'; return this }
  maybeSingle() { this.mode = 'maybe'; return this }

  run() {
    const rows = this.store[this.table]
    if (!rows) return { data: null, error: { message: `Unknown table ${this.table}` } }
    const match = (r) => this.filters.every((f) => f(r))
    const now = new Date().toISOString()

    if (this.op === 'insert' || this.op === 'upsert') {
      const items = (Array.isArray(this.payload) ? this.payload : [this.payload]).map((it) => ({ ...it }))
      for (const it of items) {
        const existing = 'id' in it && rows.find((r) => r.id === it.id)
        if (existing && this.op === 'upsert') Object.assign(existing, it, { updated_at: now })
        else if (existing) return { data: null, error: { message: 'A record with this id already exists.' } }
        else rows.push({ id: uid(), created_at: now, updated_at: now, ...it })
      }
      return { data: this.returning ? items : null, error: null }
    }
    if (this.op === 'update') {
      const hits = rows.filter(match)
      hits.forEach((r) => Object.assign(r, structuredClone(this.payload), { updated_at: now }))
      return this.shape(hits.map((r) => ({ ...r })))
    }
    if (this.op === 'delete') {
      this.store[this.table] = rows.filter((r) => !match(r))
      return { data: null, error: null }
    }

    let out = rows.filter(match)
    for (const [col, asc] of [...this.orders].reverse()) {
      out = [...out].sort((a, b) => (a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0) * (asc ? 1 : -1))
    }
    const count = out.length
    if (this.lim != null) out = out.slice(0, this.lim)
    if (this.head) return { data: null, count, error: null }
    return this.shape(out.map((r) => structuredClone(r)))
  }

  shape(list) {
    if (this.mode === 'single') return list.length === 1 ? { data: list[0], error: null } : { data: null, error: { message: 'Expected one row.' } }
    if (this.mode === 'maybe') return { data: list[0] ?? null, error: null }
    return { data: list, error: null }
  }

  // Thenable, so `await db.from(...)...` and `.then(...)` work like the real client.
  then(resolve, reject) {
    return new Promise((r) => setTimeout(r, 120)).then(() => this.run()).then(resolve, reject)
  }
}

export function createDemoClient() {
  const store = sampleData()
  let session = { user: DEMO_USER }
  const listeners = new Set()
  const emit = (event) => listeners.forEach((fn) => fn(event, session))

  return {
    from: (table) => new Query(store, table),
    auth: {
      getSession: async () => ({ data: { session } }),
      onAuthStateChange: (fn) => {
        listeners.add(fn)
        return { data: { subscription: { unsubscribe: () => listeners.delete(fn) } } }
      },
      // Any email and password signs in to the demo.
      signInWithPassword: async ({ email }) => {
        session = { user: { ...DEMO_USER, email: email || DEMO_USER.email } }
        emit('SIGNED_IN')
        return { error: null }
      },
      signOut: async () => {
        session = null
        emit('SIGNED_OUT')
        return { error: null }
      },
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ error: null }),
    },
  }
}
