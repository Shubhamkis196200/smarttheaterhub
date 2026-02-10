import { useState } from 'react'
import { Link } from 'react-router-dom'
import { tools } from '../data/tools'
import { reviews } from '../data/reviews'
import { blogPosts } from '../data/blog'
import SEO from '../components/SEO'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const [q, setQ] = useState('')
  const query = q.toLowerCase()
  const matchedTools = query ? tools.filter(t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)) : []
  const matchedReviews = query ? reviews.filter(r => r.title.toLowerCase().includes(query) || r.excerpt.toLowerCase().includes(query)) : []
  const matchedBlog = query ? blogPosts.filter(p => p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query)) : []
  const total = matchedTools.length + matchedReviews.length + matchedBlog.length

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <SEO title="Search" description="Search SmartTheaterHub tools, reviews, and guides." path="/search" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Search</h1>
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input className="tool-input" placeholder="Search tools, reviews, guides..." value={q} onChange={e => setQ(e.target.value)}
              style={{ paddingLeft: '2.5rem', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '1.1rem' }} autoFocus />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {query && <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>{total} result{total !== 1 ? 's' : ''} for "{q}"</p>}
          {matchedTools.length > 0 && <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Tools ({matchedTools.length})</h2>
            {matchedTools.map(t => (
              <Link key={t.slug} to={`/tools/${t.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                <div><h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{t.name}</h3><p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{t.description}</p></div>
              </Link>
            ))}
          </>}
          {matchedReviews.length > 0 && <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2rem 0 1rem' }}>Reviews ({matchedReviews.length})</h2>
            {matchedReviews.map(r => (
              <Link key={r.slug} to={`/reviews/${r.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: '0.75rem', display: 'block' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{r.title}</h3><p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{r.excerpt}</p>
              </Link>
            ))}
          </>}
          {matchedBlog.length > 0 && <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2rem 0 1rem' }}>Blog ({matchedBlog.length})</h2>
            {matchedBlog.map(p => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: '0.75rem', display: 'block' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{p.title}</h3><p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{p.excerpt}</p>
              </Link>
            ))}
          </>}
          {query && total === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem 0' }}>No results found. Try a different search term.</p>}
        </div>
      </section>
    </div>
  )
}
