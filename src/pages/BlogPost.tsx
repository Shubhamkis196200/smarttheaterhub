import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blog'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)
  if (!post) return <div className="container section"><h1>Post not found</h1><Link to="/blog">← Back</Link></div>

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '2.5rem 0' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <SEO title={post.title} description={post.excerpt || post.title} path={`/blog/${post.slug}`} />
          <Link to="/blog" style={{ color: '#adb5bd', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '1rem', fontSize: '0.85rem' }}><ArrowLeft size={14} /> All Posts</Link>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0077FF' }}>{post.category}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>{post.title}</h1>
          <div style={{ color: '#adb5bd', fontSize: '0.9rem' }}>{post.date} · {post.readTime} read</div>
        </div>
      </section>
      <article className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {post.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#e8e8f0' }}>{section.heading}</h2>
              {section.content.map((p, j) => (
                <p key={j} style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#c4c8d0', marginBottom: '1.25rem' }}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}
