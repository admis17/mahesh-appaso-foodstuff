import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { db } from '../client'
import { Badge, Card, ErrorNote, Loading, PageHeader } from '../ui'
import { formatDate } from '../adminUtils'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    Promise.all([
      db.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      db.from('enquiries').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
      db.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'won'),
      db.from('products').select('status'),
      db.from('enquiries').select('id, name, product, status, created_at').order('created_at', { ascending: false }).limit(6),
    ]).then(([fresh, month, won, products, latest]) => {
      const failed = [fresh, month, won, products, latest].find((r) => r.error)
      if (failed) return setError(failed.error.message)
      setData({
        fresh: fresh.count,
        month: month.count,
        won: won.count,
        live: products.data.filter((p) => p.status === 'active').length,
        hidden: products.data.filter((p) => p.status !== 'active').length,
        latest: latest.data,
      })
    })
  }, [])

  if (error) return <ErrorNote error={error} />
  if (!data) return <Loading />

  const tiles = [
    { label: 'New enquiries', value: data.fresh, to: '/admin/enquiries?status=new', highlight: data.fresh > 0 },
    { label: 'Enquiries this month', value: data.month, to: '/admin/enquiries' },
    { label: 'Won', value: data.won, to: '/admin/enquiries?status=won' },
    { label: 'Products live', value: data.live, note: data.hidden ? `${data.hidden} hidden` : null, to: '/admin/products' },
  ]

  return (
    <>
      <PageHeader title="Dashboard" description="What needs attention, at a glance." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className={`rounded-2xl border p-5 transition-colors ${t.highlight ? 'bg-gold/15 border-gold' : 'bg-ivory border-line/70 hover:border-deep/40'}`}>
            <p className="font-display text-4xl font-semibold text-ink">{t.value}</p>
            <p className="text-sm text-slate mt-1">{t.label}</p>
            {t.note && <p className="text-xs text-slate/80">{t.note}</p>}
          </Link>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-line/60">
          <h2 className="font-display text-lg font-semibold text-ink">Latest enquiries</h2>
          <Link to="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-semibold text-deep">
            Open inbox <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {data.latest.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate">No enquiries yet — they’ll appear here as soon as someone uses the contact form.</p>
        ) : (
          <ul className="divide-y divide-line/60">
            {data.latest.map((e) => (
              <li key={e.id}>
                <Link to={`/admin/enquiries?id=${e.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-sand/60">
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink truncate">{e.name}</span>
                    <span className="block text-xs text-slate truncate">{e.product || 'General enquiry'} · {formatDate(e.created_at)}</span>
                  </span>
                  <Badge tone={e.status}>{e.status}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
