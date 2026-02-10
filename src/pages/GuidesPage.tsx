import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const guides = [
  { title: 'Beginner\'s Guide to Home Theater', desc: 'Everything you need to know to get started with home theater, from choosing your first TV to setting up surround sound.', icon: '🎓', link: '/blog/how-to-build-home-theater-any-budget' },
  { title: 'Dolby Atmos Speaker Placement', desc: 'The complete guide to positioning speakers for immersive Dolby Atmos audio.', icon: '🔊', link: '/blog/complete-guide-dolby-atmos-speaker-placement' },
  { title: 'Room Acoustics 101', desc: 'Why room treatment matters more than expensive speakers, and how to do it right.', icon: '🏠', link: '/blog/room-acoustics-101-treating-home-theater' },
  { title: 'Streaming Services Compared', desc: 'Netflix, Disney+, Max, Apple TV+ — find the best combination for your needs.', icon: '📺', link: '/blog/best-streaming-services-compared-2026' },
  { title: '4K vs 8K: Worth the Upgrade?', desc: 'The science behind resolution and whether 8K makes sense for your setup.', icon: '🖥️', link: '/blog/4k-vs-8k-is-it-worth-the-upgrade' },
]

const quickGuides = [
  { title: 'How to Calibrate Your TV', link: '/tools/tv-calibration-guide', icon: '🎛️' },
  { title: 'HDMI Cable Guide', link: '/tools/hdmi-bandwidth-calculator', icon: '🔌' },
  { title: 'Speaker Wire Sizing', link: '/tools/wire-gauge-calculator', icon: '🔗' },
  { title: 'Room EQ Wizard Setup', link: '/tools/room-eq-wizard-guide', icon: '📋' },
  { title: 'Screen Size Guide', link: '/tools/screen-size-calculator', icon: '📐' },
  { title: 'Subwoofer Placement', link: '/tools/subwoofer-placement', icon: '💥' },
]

export default function GuidesPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '3rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Buying Guides</h1>
          <p style={{ color: '#adb5bd', fontSize: '1.1rem' }}>In-depth guides to help you build the perfect home theater</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Comprehensive Guides</h2>
          <div className="grid-2" style={{ marginBottom: '3rem' }}>
            {guides.map(g => (
              <Link key={g.title} to={g.link} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{g.icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.375rem' }}>{g.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6c757d', lineHeight: 1.5 }}>{g.desc}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 600, color: '#0077FF', marginTop: '0.75rem' }}>Read Guide <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Quick Reference Guides</h2>
          <div className="grid-3">
            {quickGuides.map(g => (
              <Link key={g.title} to={g.link} className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{g.icon}</div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{g.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
