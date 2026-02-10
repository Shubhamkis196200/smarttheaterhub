import { Link } from 'react-router-dom'
import { reviews } from '../data/reviews'
import { Star } from 'lucide-react'
import SEO from '../components/SEO'

export default function ReviewsPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '3rem 0', textAlign: 'center' }}>
        <div className="container">
          <SEO title="Expert Reviews" description="In-depth home theater reviews — TVs, projectors, speakers, soundbars, and AV receivers tested and rated." path="/reviews" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Expert Reviews</h1>
          <p style={{ color: '#adb5bd', fontSize: '1.1rem' }}>Thoroughly tested, honestly rated home theater equipment</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="grid-2">
            {reviews.map(r => (
              <Link key={r.slug} to={`/reviews/${r.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontSize: '3rem', textAlign: 'center', padding: '1.5rem', background: '#171728', borderRadius: 8, marginBottom: '1rem' }}>{r.image}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#0077FF', color: '#fff', padding: '0.125rem 0.5rem', borderRadius: 4 }}>{r.category}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{r.date} · {r.readTime}</span>
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{r.title}</h2>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5 }}>{r.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.75rem' }}>
                  <Star size={14} fill="#0077FF" color="#0077FF" /><span style={{ fontWeight: 700, color: '#0077FF', fontSize: '0.9rem' }}>{r.rating}/5</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
