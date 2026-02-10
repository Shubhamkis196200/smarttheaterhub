import { useState } from 'react'
import SEO from '../components/SEO'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '3rem 0', textAlign: 'center' }}>
        <div className="container">
          <SEO title="Contact Us" description="Get in touch with SmartTheaterHub — questions, suggestions, partnerships, and bug reports." path="/contact" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Contact Us</h1>
          <p style={{ color: '#adb5bd', fontSize: '1.1rem' }}>Have a question, suggestion, or partnership inquiry?</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 600 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Message Sent!</h2>
              <p style={{ color: '#9ca3af' }}>We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form name="contact" method="POST" data-netlify="true" onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fd as any).toString() }).then(() => setSubmitted(true)).catch(() => setSubmitted(true)) }}>
              <input type="hidden" name="form-name" value="contact" />
              <div style={{ marginBottom: '1rem' }}>
                <label className="tool-label">Name</label>
                <input className="tool-input" name="name" placeholder="Your name" required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="tool-label">Email</label>
                <input className="tool-input" name="email" type="email" placeholder="your@email.com" required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="tool-label">Subject</label>
                <select className="tool-input" name="subject">
                  <option>General Question</option>
                  <option>Tool Suggestion</option>
                  <option>Review Request</option>
                  <option>Partnership / Advertising</option>
                  <option>Bug Report</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="tool-label">Message</label>
                <textarea className="tool-input" name="message" rows={5} placeholder="How can we help?" required style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Message</button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
