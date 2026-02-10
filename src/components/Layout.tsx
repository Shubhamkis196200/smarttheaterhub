import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Search, Menu, X, Play, ChevronDown } from 'lucide-react'

const categories = [
  { name: 'TVs', slug: 'tvs', icon: '📺' },
  { name: 'Projectors', slug: 'projectors', icon: '🎬' },
  { name: 'Speakers', slug: 'speakers', icon: '🔊' },
  { name: 'Soundbars', slug: 'soundbars', icon: '📻' },
  { name: 'AV Receivers', slug: 'av-receivers', icon: '🎛️' },
  { name: 'Streaming', slug: 'streaming', icon: '📡' },
  { name: 'Cables', slug: 'cables', icon: '🔌' },
  { name: 'Smart Home', slug: 'smart-home', icon: '🏠' },
]

export default function Layout() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#171728', borderBottom: '1px solid #2a2a4e', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#e8e8f0' }}>
            <div style={{ width: 32, height: 32, background: '#0077FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={16} fill="#fff" color="#fff" />
            </div>
            SmartTheaterHub
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
            <Link to="/reviews" style={{ fontWeight: 600, fontSize: '0.9rem', color: location.pathname.startsWith('/reviews') ? '#0077FF' : '#e8e8f0' }}>Reviews</Link>
            <div style={{ position: 'relative' }} onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#e8e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Categories <ChevronDown size={14} />
              </span>
              {catOpen && (
                <div style={{ position: 'absolute', top: '100%', left: '-1rem', background: '#171728', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '0.5rem', minWidth: 200, border: '1px solid #2a2a4e' }}>
                  {categories.map(c => (
                    <Link key={c.slug} to={`/category/${c.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 8, color: '#e8e8f0', fontSize: '0.9rem' }}
                      onMouseOver={e => (e.currentTarget.style.background = '#1e1e35')} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                      <span>{c.icon}</span> {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/tools" style={{ fontWeight: 600, fontSize: '0.9rem', color: location.pathname.startsWith('/tools') ? '#0077FF' : '#e8e8f0' }}>Tools</Link>
            <Link to="/guides" style={{ fontWeight: 600, fontSize: '0.9rem', color: location.pathname.startsWith('/guides') ? '#0077FF' : '#e8e8f0' }}>Guides</Link>
            <Link to="/blog" style={{ fontWeight: 600, fontSize: '0.9rem', color: location.pathname.startsWith('/blog') ? '#0077FF' : '#e8e8f0' }}>Blog</Link>
            <Link to="/search" style={{ color: '#6c757d' }}><Search size={18} /></Link>
          </nav>

          <button onClick={() => setMobileMenu(!mobileMenu)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#e8e8f0' }} className="mobile-toggle">
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenu && (
          <div className="mobile-menu" style={{ background: '#171728', borderTop: '1px solid #2a2a4e', padding: '1rem' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/reviews" onClick={() => setMobileMenu(false)} style={{ fontWeight: 600, fontSize: '1rem', color: location.pathname.startsWith('/reviews') ? '#0077FF' : '#e8e8f0', padding: '0.5rem 0' }}>Reviews</Link>
              <Link to="/tools" onClick={() => setMobileMenu(false)} style={{ fontWeight: 600, fontSize: '1rem', color: location.pathname.startsWith('/tools') ? '#0077FF' : '#e8e8f0', padding: '0.5rem 0' }}>Tools</Link>
              <Link to="/guides" onClick={() => setMobileMenu(false)} style={{ fontWeight: 600, fontSize: '1rem', color: location.pathname.startsWith('/guides') ? '#0077FF' : '#e8e8f0', padding: '0.5rem 0' }}>Guides</Link>
              <Link to="/blog" onClick={() => setMobileMenu(false)} style={{ fontWeight: 600, fontSize: '1rem', color: location.pathname.startsWith('/blog') ? '#0077FF' : '#e8e8f0', padding: '0.5rem 0' }}>Blog</Link>
              <div style={{ borderTop: '1px solid #2a2a4e', paddingTop: '0.75rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>Categories</p>
                {categories.map(c => (
                  <Link key={c.slug} to={`/category/${c.slug}`} onClick={() => setMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0', color: '#e8e8f0', fontSize: '0.9rem' }}>
                    <span>{c.icon}</span> {c.name}
                  </Link>
                ))}
              </div>
              <Link to="/search" onClick={() => setMobileMenu(false)} style={{ fontWeight: 600, fontSize: '1rem', color: '#e8e8f0', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={16} /> Search
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#0a0a15', color: '#fff', padding: '3rem 0 1.5rem' }}>
        <div className="container">
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>SmartTheaterHub</h3>
              <p style={{ color: '#adb5bd', fontSize: '0.85rem', lineHeight: 1.6 }}>Your trusted source for home theater reviews, guides, and free tools to build the perfect entertainment setup.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#0077FF' }}>Categories</h4>
              {categories.slice(0, 4).map(c => (
                <Link key={c.slug} to={`/category/${c.slug}`} style={{ display: 'block', color: '#adb5bd', fontSize: '0.85rem', marginBottom: '0.375rem' }}>{c.name}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#0077FF' }}>Resources</h4>
              <Link to="/tools" style={{ display: 'block', color: '#adb5bd', fontSize: '0.85rem', marginBottom: '0.375rem' }}>Free Tools</Link>
              <Link to="/guides" style={{ display: 'block', color: '#adb5bd', fontSize: '0.85rem', marginBottom: '0.375rem' }}>Buying Guides</Link>
              <Link to="/blog" style={{ display: 'block', color: '#adb5bd', fontSize: '0.85rem', marginBottom: '0.375rem' }}>Blog</Link>
              <Link to="/reviews" style={{ display: 'block', color: '#adb5bd', fontSize: '0.85rem', marginBottom: '0.375rem' }}>Reviews</Link>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#0077FF' }}>Company</h4>
              <Link to="/about" style={{ display: 'block', color: '#adb5bd', fontSize: '0.85rem', marginBottom: '0.375rem' }}>About</Link>
              <Link to="/contact" style={{ display: 'block', color: '#adb5bd', fontSize: '0.85rem', marginBottom: '0.375rem' }}>Contact</Link>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #2a2a4e', paddingTop: '1.5rem', textAlign: 'center', color: '#6c757d', fontSize: '0.8rem' }}>
            © 2026 SmartTheaterHub. All rights reserved. | Expert home theater advice you can trust.
          </div>
        </div>
      </footer>
    </div>
  )
}
