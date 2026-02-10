import { Link } from 'react-router-dom'
import { tools } from '../data/tools'
import { reviews } from '../data/reviews'
import { blogPosts } from '../data/blog'
import { ArrowRight, Star, Calculator, BookOpen } from 'lucide-react'

const categories = [
  { name: 'TVs', slug: 'tvs', icon: '📺', count: 45 },
  { name: 'Projectors', slug: 'projectors', icon: '🎬', count: 32 },
  { name: 'Speakers', slug: 'speakers', icon: '🔊', count: 38 },
  { name: 'Soundbars', slug: 'soundbars', icon: '📻', count: 27 },
  { name: 'AV Receivers', slug: 'av-receivers', icon: '🎛️', count: 21 },
  { name: 'Streaming', slug: 'streaming', icon: '📡', count: 19 },
  { name: 'Cables', slug: 'cables', icon: '🔌', count: 12 },
  { name: 'Smart Home', slug: 'smart-home', icon: '🏠', count: 15 },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#fff', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0077FF', marginBottom: '1rem', letterSpacing: 1 }}>YOUR HOME THEATER COMMAND CENTER</div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Expert Reviews, Free Tools &<br />
            <span style={{ color: '#0077FF' }}>50+ Calculators</span> for Your<br />
            Perfect Home Theater
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#adb5bd', maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            From screen size calculators to speaker placement guides — everything you need to build, optimize, and enjoy your dream entertainment setup.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/tools" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 1.75rem' }}>
              <Calculator size={18} /> Explore 50 Free Tools
            </Link>
            <Link to="/reviews" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.875rem 1.75rem', borderColor: '#fff', color: '#fff' }}>
              <BookOpen size={18} /> Read Reviews
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
            {[['50+', 'Free Tools'], ['10', 'Expert Reviews'], ['5', 'In-Depth Guides'], ['8', 'Categories']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0077FF' }}>{n}</div>
                <div style={{ fontSize: '0.8rem', color: '#adb5bd' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>Browse by Category</h2>
          <p style={{ textAlign: 'center', color: '#6c757d', marginBottom: '2.5rem' }}>Find reviews and guides for every component of your home theater</p>
          <div className="grid-4">
            {categories.map(c => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="card" style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{c.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{c.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>{c.count} reviews & guides</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Reviews */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Latest Reviews</h2>
              <p style={{ color: '#6c757d' }}>Expert-tested, real-world reviews</p>
            </div>
            <Link to="/reviews" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid-3">
            {reviews.slice(0, 6).map(r => (
              <Link key={r.slug} to={`/reviews/${r.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center', padding: '1.5rem 0', background: '#f8f9fa', borderRadius: 8 }}>{r.image}</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#0077FF', color: '#fff', padding: '0.125rem 0.5rem', borderRadius: 4 }}>{r.category}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>{r.date}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{r.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6c757d', lineHeight: 1.5 }}>{r.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.75rem' }}>
                  <Star size={14} fill="#0077FF" color="#0077FF" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0077FF' }}>{r.rating}</span>
                  <span style={{ fontSize: '0.8rem', color: '#6c757d', marginLeft: '0.5rem' }}>{r.readTime} read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Preview */}
      <section className="section" style={{ background: '#1a1a2e', color: '#fff' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>50+ Free Home Theater Tools</h2>
          <p style={{ textAlign: 'center', color: '#adb5bd', marginBottom: '2.5rem' }}>Calculators, guides, and planners — all free, no signup required</p>
          <div className="grid-4">
            {tools.slice(0, 8).map(t => (
              <Link key={t.slug} to={`/tools/${t.slug}`} className="card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.icon}</div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>{t.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#adb5bd' }}>{t.description}</p>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/tools" className="btn btn-primary">View All 50 Tools <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>From the Blog</h2>
              <p style={{ color: '#6c757d' }}>In-depth guides and analysis</p>
            </div>
            <Link to="/blog" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid-3">
            {blogPosts.slice(0, 3).map(p => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0077FF' }}>{p.category}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.5rem 0', lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6c757d', lineHeight: 1.5 }}>{p.excerpt}</p>
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.75rem' }}>{p.date} · {p.readTime} read</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #0077FF, #0055cc)', padding: '4rem 0', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Build Your Dream Theater?</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>Start with our free tools and expert guides to make informed decisions at every step.</p>
          <Link to="/tools" className="btn" style={{ background: '#fff', color: '#0077FF', fontWeight: 700, fontSize: '1rem', padding: '0.875rem 2rem' }}>Get Started Free <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  )
}
