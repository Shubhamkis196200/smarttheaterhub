import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '3rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>About SmartTheaterHub</h1>
          <p style={{ color: '#adb5bd', fontSize: '1.1rem' }}>Your trusted source for home theater expertise</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#333', marginBottom: '1.5rem' }}>
            SmartTheaterHub was built to be the most useful resource for home theater enthusiasts at every level. Whether you're buying your first soundbar or designing a dedicated Dolby Atmos theater room, we provide the tools, reviews, and guides to help you make informed decisions.
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>What We Offer</h2>
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {[
              { icon: '🔧', title: '50+ Free Tools', desc: 'Interactive calculators for screen size, speaker placement, room acoustics, budgeting, and more.' },
              { icon: '⭐', title: 'Expert Reviews', desc: 'Thoroughly tested equipment reviews with real-world performance data and honest ratings.' },
              { icon: '📚', title: 'In-Depth Guides', desc: 'Comprehensive guides covering everything from budget setups to premium Atmos installations.' },
              { icon: '💡', title: 'Buying Advice', desc: 'Budget-conscious recommendations that help you get the most value for your money.' },
            ].map(item => (
              <div key={item.title} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Editorial Independence</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#333', marginBottom: '1.5rem' }}>
            Our reviews and recommendations are based on real testing and expertise. When we include affiliate links, they don't influence our ratings or recommendations. We recommend products we'd buy ourselves, regardless of commission rates.
          </p>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/tools" className="btn btn-primary">Explore Our Tools</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
