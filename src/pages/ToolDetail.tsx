import { useParams, Link } from 'react-router-dom'
import { tools } from '../data/tools'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'
import { toolRegistry } from '../tools/registry'

export default function ToolDetail() {
  const { slug } = useParams()
  const tool = tools.find(t => t.slug === slug)
  if (!tool) return <div className="container section"><h1>Tool not found</h1><Link to="/tools">← Back to Tools</Link></div>

  const ToolComponent = slug ? toolRegistry[slug] : null

  return (
    <div>
      <section className="text-white py-10" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
        <div className="container">
          <SEO title={tool.name} description={`Free ${tool.name.toLowerCase()} — ${tool.description}. No signup required.`} path={`/tools/${tool.slug}`} type="tool" toolName={tool.name} toolCategory={tool.category} />
          <Link to="/tools" className="text-gray-400 flex items-center gap-1 mb-4 text-sm hover:text-white transition-colors"><ArrowLeft size={14} /> All Tools</Link>
          <div className="text-4xl mb-2">{tool.icon}</div>
          <h1 className="text-3xl font-extrabold mb-2">{tool.name}</h1>
          <p className="text-gray-400">{tool.description}</p>
          <span className="text-xs font-semibold px-3 py-1 rounded mt-2 inline-block" style={{ background: 'rgba(0,119,255,0.2)', color: '#0077FF' }}>{tool.category}</span>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="card">
            {ToolComponent ? <ToolComponent /> : <div className="tool-result"><p>Tool coming soon! Check back for updates.</p></div>}
          </div>
        </div>
      </section>
    </div>
  )
}
