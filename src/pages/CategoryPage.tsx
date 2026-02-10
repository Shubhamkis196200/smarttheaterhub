import { useParams, Link } from 'react-router-dom'
import { reviews } from '../data/reviews'
import { tools } from '../data/tools'
import { Star } from 'lucide-react'

const catInfo: Record<string, { name: string; desc: string; icon: string }> = {
  'tvs': { name: 'TVs & Displays', desc: 'OLED, QLED, Mini LED — find the perfect TV for your setup', icon: '📺' },
  'projectors': { name: 'Projectors', desc: 'From ultra-short throw to long-throw cinema projectors', icon: '🎬' },
  'speakers': { name: 'Speakers', desc: 'Bookshelf, floor-standing, in-wall, and surround speakers', icon: '🔊' },
  'soundbars': { name: 'Soundbars', desc: 'From budget to Dolby Atmos soundbar systems', icon: '📻' },
  'av-receivers': { name: 'AV Receivers', desc: 'The heart of your home theater audio system', icon: '🎛️' },
  'streaming': { name: 'Streaming', desc: 'Streaming devices, services, and cord-cutting guides', icon: '📡' },
  'cables': { name: 'Cables & Connectivity', desc: 'HDMI, speaker wire, optical — what you actually need', icon: '🔌' },
  'smart-home': { name: 'Smart Home', desc: 'Voice control, automation, and smart theater integration', icon: '🏠' },
}

const catReviewMap: Record<string, string[]> = {
  'tvs': ['oled-vs-qled'],
  'projectors': ['best-4k-projectors-under-2000'],
  'speakers': ['best-wireless-surround-sound', 'budget-home-theater-under-500', 'best-in-wall-in-ceiling-speakers'],
  'soundbars': ['top-10-soundbars-ranked'],
  'av-receivers': ['best-av-receivers-dolby-atmos'],
  'streaming': ['best-streaming-devices-compared'],
  'cables': ['premium-hdmi-cables-do-they-matter'],
  'smart-home': ['smart-home-theater-integration'],
}

export default function CategoryPage() {
  const { slug } = useParams()
  const info = catInfo[slug || '']
  if (!info) return <div className="container section"><h1>Category not found</h1></div>
  const catReviews = (catReviewMap[slug || ''] || []).map(s => reviews.find(r => r.slug === s)).filter(Boolean) as typeof reviews

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '3rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{info.icon}</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>{info.name}</h1>
          <p style={{ color: '#adb5bd', fontSize: '1.1rem' }}>{info.desc}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {catReviews.length > 0 && <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Reviews</h2>
            <div className="grid-2" style={{ marginBottom: '3rem' }}>
              {catReviews.map(r => (
                <Link key={r.slug} to={`/reviews/${r.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{r.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.5rem' }}>{r.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={14} fill="#0077FF" color="#0077FF" /><span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0077FF' }}>{r.rating}/5</span>
                  </div>
                </Link>
              ))}
            </div>
          </>}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Related Tools</h2>
          <div className="grid-3">
            {tools.slice(0, 6).map(t => (
              <Link key={t.slug} to={`/tools/${t.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0.5rem 0 0.25rem' }}>{t.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
