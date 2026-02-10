import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎬</div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', color: '#e8e8f0' }}>404 — Scene Not Found</h1>
      <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
        Looks like this reel is missing from the vault. Let's get you back to the main feature.
      </p>
      <Link to="/" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 1.75rem' }}>
        Back to Home
      </Link>
    </div>
  )
}
