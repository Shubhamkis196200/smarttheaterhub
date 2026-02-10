import { useState } from 'react'

export function N(v: string, d = 0) { const n = parseFloat(v); return isNaN(n) ? d : n }

export function useToolState() {
  const [v, setV] = useState<Record<string, string>>({})
  const s = (k: string) => v[k] || ''
  const u = (k: string, val: string) => setV(p => ({ ...p, [k]: val }))
  return { s, u }
}

export function Input({ label, k, ph, unit, s, u }: { label: string; k: string; ph?: string; unit?: string; s: (k: string) => string; u: (k: string, v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="tool-label">{label} {unit && <span className="text-gray-400 font-normal">({unit})</span>}</label>
      <input className="tool-input" placeholder={ph || ''} value={s(k)} onChange={e => u(k, e.target.value)} type="number" />
    </div>
  )
}

export function TextInput({ label, k, ph, s, u }: { label: string; k: string; ph?: string; s: (k: string) => string; u: (k: string, v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="tool-label">{label}</label>
      <input className="tool-input" placeholder={ph || ''} value={s(k)} onChange={e => u(k, e.target.value)} />
    </div>
  )
}

export function Select({ label, k, options, s, u }: { label: string; k: string; options: [string, string][]; s: (k: string) => string; u: (k: string, v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="tool-label">{label}</label>
      <select className="tool-input" value={s(k)} onChange={e => u(k, e.target.value)}>
        <option value="">Select...</option>
        {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
      </select>
    </div>
  )
}

export function Result({ children }: { children: React.ReactNode }) {
  return <div className="tool-result">{children}</div>
}

export type ToolComponent = () => React.JSX.Element
