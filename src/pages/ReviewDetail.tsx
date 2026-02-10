import { useParams, Link } from 'react-router-dom'
import { reviews } from '../data/reviews'
import { ArrowLeft, Star } from 'lucide-react'
import SEO from '../components/SEO'

export default function ReviewDetail() {
  const { slug } = useParams()
  const review = reviews.find(r => r.slug === slug)
  if (!review) return <div className="container section"><h1>Review not found</h1><Link to="/reviews">← Back</Link></div>

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '2.5rem 0' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <SEO title={review.title} description={review.excerpt || review.title} path={`/reviews/${review.slug}`} />
          <Link to="/reviews" style={{ color: '#adb5bd', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '1rem', fontSize: '0.85rem' }}><ArrowLeft size={14} /> All Reviews</Link>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, background: 'rgba(0,119,255,0.2)', color: '#0077FF', padding: '0.25rem 0.75rem', borderRadius: 4 }}>{review.category}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.75rem 0 0.5rem' }}>{review.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#adb5bd', fontSize: '0.9rem' }}>
            <span>{review.date}</span><span>·</span><span>{review.readTime} read</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={14} fill="#0077FF" color="#0077FF" /> {review.rating}/5</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {review.content.map((p, i) => (
            <p key={i} style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#c4c8d0', marginBottom: '1.25rem' }}>{p}</p>
          ))}
          {review.products && <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2rem 0 1.5rem', borderBottom: '3px solid #0077FF', paddingBottom: '0.5rem' }}>Our Top Picks</h2>
            {review.products.map((p, i) => (
              <div key={i} className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>#{i + 1} {p.name}</h3>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0077FF' }}>{p.price}</span>
                  </div>
                  <div style={{ background: '#1a1a2e', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: 8, fontWeight: 800, fontSize: '1.1rem' }}>{p.rating}/10</div>
                </div>
                <div className="grid-2" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4CAF50', marginBottom: '0.375rem' }}>PROS</h4>
                    {p.pros.map((pro, j) => <p key={j} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>✅ {pro}</p>)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f44336', marginBottom: '0.375rem' }}>CONS</h4>
                    {p.cons.map((con, j) => <p key={j} style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>❌ {con}</p>)}
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#c4c8d0', fontStyle: 'italic', background: '#171728', padding: '0.75rem', borderRadius: 8 }}>💬 {p.verdict}</p>
              </div>
            ))}
          </>}
        </div>
      </section>
    </div>
  )
}
