import { Link } from 'react-router-dom'
import { tools, toolCategories } from '../data/tools'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function ToolsPage() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const filtered = tools.filter(t =>
    (activeCat === 'All' || t.category === activeCat) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  )
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>50 Free Home Theater Tools</h1>
          <p style={{ color: '#adb5bd', fontSize: '1.1rem', marginBottom: '2rem' }}>Calculators, guides, and planners — all free, no signup</p>
          <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
            <input className="tool-input" placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', color: '#fff' }} />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {['All', ...toolCategories].map(c => (
              <button key={c} onClick={() => setActiveCat(c)} className="btn" style={{
                background: activeCat === c ? '#0077FF' : '#f1f3f5',
                color: activeCat === c ? '#fff' : '#495057',
                fontSize: '0.85rem', padding: '0.5rem 1rem'
              }}>{c} {c === 'All' ? `(${tools.length})` : `(${tools.filter(t => t.category === c).length})`}</button>
            ))}
          </div>
          <div className="grid-3">
            {filtered.map(t => (
              <Link key={t.slug} to={`/tools/${t.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>{t.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>{t.description}</p>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0077FF', marginTop: '0.5rem', display: 'inline-block' }}>{t.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
