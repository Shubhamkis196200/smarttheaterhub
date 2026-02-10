import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blog'
import SEO from '../components/SEO'

export default function BlogPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '3rem 0', textAlign: 'center' }}>
        <div className="container">
          <SEO title="Blog" description="Home theater tips, setup guides, and industry news from SmartTheaterHub." path="/blog" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Blog</h1>
          <p style={{ color: '#adb5bd', fontSize: '1.1rem' }}>In-depth guides, analysis, and home theater insights</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {blogPosts.map(p => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit', marginBottom: '1.5rem', display: 'block' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0077FF' }}>{p.category}</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.5rem 0' }}>{p.title}</h2>
              <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>{p.excerpt}</p>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.75rem' }}>{p.date} · {p.readTime} read</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
