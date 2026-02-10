import { N, useToolState, Input, Select, Result } from './shared'

// FIXED: Budget planner now properly allocates to Display (highest category)
export function BudgetPlanner() {
  const { s, u } = useToolState()
  const budget = N(s('budget'))
  const includeDisplay = s('includeDisplay') || 'yes'
  const categories = includeDisplay === 'yes' ? [
    { name: 'Display (TV/Projector)', pct: 35, color: '#9C27B0' },
    { name: 'Speakers', pct: 20, color: '#0077FF' },
    { name: 'AV Receiver', pct: 15, color: '#4CAF50' },
    { name: 'Subwoofer', pct: 10, color: '#FF9800' },
    { name: 'Room Treatment', pct: 8, color: '#607D8B' },
    { name: 'Cables & Accessories', pct: 5, color: '#795548' },
    { name: 'Contingency', pct: 7, color: '#E91E63' },
  ] : [
    { name: 'Speakers', pct: 35, color: '#0077FF' },
    { name: 'AV Receiver', pct: 22, color: '#4CAF50' },
    { name: 'Subwoofer', pct: 18, color: '#FF9800' },
    { name: 'Room Treatment', pct: 12, color: '#607D8B' },
    { name: 'Cables & Accessories', pct: 5, color: '#795548' },
    { name: 'Contingency', pct: 8, color: '#E91E63' },
  ]
  return <div>
    <Input label="Total Budget" k="budget" ph="5000" unit="$" s={s} u={u} />
    <Select label="Include Display?" k="includeDisplay" options={[['yes','Yes — full home theater budget'],['no','No — audio/accessories only']]} s={s} u={u} />
    {budget > 0 && <Result>
      <h4>Budget Allocation {includeDisplay !== 'yes' ? '(Audio Only)' : ''}</h4>
      {categories.map(item => (
        <div key={item.name} className="mb-2">
          <div className="flex justify-between text-sm mb-0.5">
            <span>{item.name}</span>
            <strong>${(budget * item.pct / 100).toFixed(0)} ({item.pct}%)</strong>
          </div>
          <div className="rounded" style={{ height: 8, background: '#2a2a4e' }}>
            <div className="rounded h-full" style={{ width: `${item.pct}%`, background: item.color }} />
          </div>
        </div>
      ))}
      <p className="mt-4 text-sm text-gray-400">
        {includeDisplay === 'yes'
          ? 'Display is typically the largest investment. Adjust based on whether you prioritize picture quality or audio immersion.'
          : 'Audio-only budget: speakers are the most important investment — they last 15+ years.'}
      </p>
    </Result>}
  </div>
}

export function PricePerInch() {
  const { s, u } = useToolState()
  const price = N(s('price')); const size = N(s('size'))
  return <div>
    <Input label="TV Price" k="price" ph="1499" unit="$" s={s} u={u} />
    <Input label="Screen Size" k="size" ph="65" unit="inches diagonal" s={s} u={u} />
    {price > 0 && size > 0 && <Result>
      <h4>Value Analysis</h4>
      <p><strong>Price Per Inch:</strong> ${(price / size).toFixed(2)}/inch</p>
      <p><strong>Price Per Square Inch:</strong> ${(price / (size * 0.872 * size * 0.49)).toFixed(4)}/sq inch</p>
      <p><strong>Value Rating:</strong> {price / size < 15 ? '🌟 Excellent value' : price / size < 25 ? '✅ Good value' : price / size < 40 ? '👍 Fair' : '💰 Premium'}</p>
    </Result>}
  </div>
}

export function CostPerYear() {
  const { s, u } = useToolState()
  const price = N(s('price')); const watts = N(s('watts')); const hrs = N(s('hrs'), 4)
  const rate = N(s('rate'), 0.12); const subs = N(s('subs')); const years = N(s('years'), 5)
  const power = watts * hrs * 365 / 1000 * rate
  const annual = price / years + power + subs * 12
  return <div>
    <Input label="Equipment Price" k="price" ph="2000" unit="$" s={s} u={u} />
    <Input label="Power Consumption" k="watts" ph="200" unit="watts" s={s} u={u} />
    <Input label="Daily Usage" k="hrs" ph="4" unit="hours" s={s} u={u} />
    <Input label="Monthly Subscriptions" k="subs" ph="45" unit="$/month" s={s} u={u} />
    <Input label="Expected Lifespan" k="years" ph="5" unit="years" s={s} u={u} />
    {price > 0 && <Result>
      <h4>Annual Total Cost of Ownership</h4>
      <p><strong>Equipment (amortized):</strong> ${(price / (years || 5)).toFixed(2)}/year</p>
      <p><strong>Electricity:</strong> ${power.toFixed(2)}/year</p>
      <p><strong>Subscriptions:</strong> ${(subs * 12).toFixed(2)}/year</p>
      <p className="text-lg font-bold mt-2"><strong>Total:</strong> ${annual.toFixed(2)}/year (${(annual / 12).toFixed(2)}/month)</p>
    </Result>}
  </div>
}

export function StreamingServiceCalculator() {
  const { s, u } = useToolState()
  const selected = (s('selected') || '').split(',').filter(Boolean)
  const toggleSel = (id: string) => { const n = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]; u('selected', n.join(',')) }
  const services = [
    { id: 'netflix', name: 'Netflix Standard', price: 17.99, content: 'Originals, movies, TV' },
    { id: 'disney', name: 'Disney+ (No Ads)', price: 13.99, content: 'Disney, Marvel, Star Wars' },
    { id: 'max', name: 'Max (Ad-Free)', price: 16.99, content: 'HBO, Warner Bros, DC' },
    { id: 'apple', name: 'Apple TV+', price: 9.99, content: 'Premium originals' },
    { id: 'hulu', name: 'Hulu (No Ads)', price: 18.99, content: 'Current TV, originals' },
    { id: 'peacock', name: 'Peacock Premium', price: 7.99, content: 'NBC, Universal, sports' },
    { id: 'paramount', name: 'Paramount+', price: 12.99, content: 'CBS, Paramount, sports' },
    { id: 'amazon', name: 'Prime Video', price: 8.99, content: 'Amazon originals, rental hub' },
  ]
  const total = services.filter(sv => selected.includes(sv.id)).reduce((a, sv) => a + sv.price, 0)
  return <div>
    <p className="text-sm text-gray-400 mb-4">Select your streaming services:</p>
    {services.map(svc => (
      <label key={svc.id} className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-white/5 mb-1">
        <input type="checkbox" checked={selected.includes(svc.id)} onChange={() => toggleSel(svc.id)} />
        <div className="flex-1"><strong>{svc.name}</strong> <span className="text-gray-400 text-sm">— {svc.content}</span></div>
        <strong>${svc.price}/mo</strong>
      </label>
    ))}
    <Result>
      <h4>Your Streaming Costs</h4>
      <p><strong>Monthly:</strong> ${total.toFixed(2)}</p>
      <p><strong>Annual:</strong> ${(total * 12).toFixed(2)}</p>
      <p><strong>Services:</strong> {selected.length} selected</p>
      {total > 50 && <p className="text-amber-500">💡 Consider rotating services monthly instead of subscribing to all at once.</p>}
    </Result>
  </div>
}

export function EquipmentComparison() {
  const { s, u } = useToolState()
  return <div>
    <div className="grid-2">
      <div>
        <h4 className="mb-3">Device A</h4>
        <Input label="Name" k="a_name" ph="LG C4 OLED" s={s} u={u} />
        <Input label="Price" k="a_price" ph="1799" unit="$" s={s} u={u} />
        <Input label="Size" k="a_size" ph="65" unit="inches" s={s} u={u} />
        <Input label="Rating" k="a_rating" ph="9.5" unit="/10" s={s} u={u} />
      </div>
      <div>
        <h4 className="mb-3">Device B</h4>
        <Input label="Name" k="b_name" ph="Samsung QN90D" s={s} u={u} />
        <Input label="Price" k="b_price" ph="1299" unit="$" s={s} u={u} />
        <Input label="Size" k="b_size" ph="65" unit="inches" s={s} u={u} />
        <Input label="Rating" k="b_rating" ph="8.9" unit="/10" s={s} u={u} />
      </div>
    </div>
    {(s('a_name') || s('b_name')) && <Result>
      <h4>Comparison</h4>
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead><tr style={{ borderBottom: '2px solid #dee2e6' }}><th className="text-left p-2"></th><th className="p-2">{s('a_name') || 'A'}</th><th className="p-2">{s('b_name') || 'B'}</th></tr></thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #2a2a4e' }}><td className="p-2">Price</td><td className="p-2 text-center" style={{ fontWeight: N(s('a_price')) <= N(s('b_price')) ? 700 : 400, color: N(s('a_price')) <= N(s('b_price')) ? '#4CAF50' : undefined }}>${s('a_price')}</td><td className="p-2 text-center" style={{ fontWeight: N(s('b_price')) <= N(s('a_price')) ? 700 : 400, color: N(s('b_price')) <= N(s('a_price')) ? '#4CAF50' : undefined }}>${s('b_price')}</td></tr>
          <tr style={{ borderBottom: '1px solid #2a2a4e' }}><td className="p-2">Price/Inch</td><td className="p-2 text-center">${(N(s('a_price'))/N(s('a_size'))).toFixed(2)}</td><td className="p-2 text-center">${(N(s('b_price'))/N(s('b_size'))).toFixed(2)}</td></tr>
          <tr><td className="p-2">Rating</td><td className="p-2 text-center" style={{ fontWeight: N(s('a_rating')) >= N(s('b_rating')) ? 700 : 400, color: N(s('a_rating')) >= N(s('b_rating')) ? '#4CAF50' : undefined }}>{s('a_rating')}/10</td><td className="p-2 text-center" style={{ fontWeight: N(s('b_rating')) >= N(s('a_rating')) ? 700 : 400, color: N(s('b_rating')) >= N(s('a_rating')) ? '#4CAF50' : undefined }}>{s('b_rating')}/10</td></tr>
        </tbody>
      </table>
    </Result>}
  </div>
}

export function UpgradePriorityPlanner() {
  const { s, u } = useToolState()
  const tv_age = N(s('tv_age')); const speaker_age = N(s('speaker_age')); const avr_age = N(s('avr_age'))
  const items = [
    { name: 'Speakers', age: speaker_age, priority: speaker_age > 8 ? 'High' : speaker_age > 5 ? 'Medium' : 'Low' },
    { name: 'AV Receiver', age: avr_age, priority: avr_age > 5 ? 'High' : avr_age > 3 ? 'Medium' : 'Low' },
    { name: 'TV/Display', age: tv_age, priority: tv_age > 6 ? 'High' : tv_age > 4 ? 'Medium' : 'Low' },
  ].sort((a, b) => (b.age || 0) - (a.age || 0))
  return <div>
    <Input label="TV/Display Age" k="tv_age" ph="5" unit="years" s={s} u={u} />
    <Input label="Speaker Age" k="speaker_age" ph="3" unit="years" s={s} u={u} />
    <Input label="AV Receiver Age" k="avr_age" ph="4" unit="years" s={s} u={u} />
    {(tv_age > 0 || speaker_age > 0 || avr_age > 0) && <Result>
      <h4>Upgrade Priority</h4>
      {items.map((item, i) => (
        <p key={item.name}><strong>#{i+1} {item.name}</strong> ({item.age || 0} yr) — <span style={{ color: item.priority === 'High' ? '#f44336' : item.priority === 'Medium' ? '#FF9800' : '#4CAF50' }}>{item.priority}</span></p>
      ))}
      <p className="mt-2 text-sm text-gray-400">AVRs age fastest (HDMI standards). Good speakers last 15+ years.</p>
    </Result>}
  </div>
}

export function UsedEquipmentEstimator() {
  const { s, u } = useToolState()
  const original = N(s('original')); const age = N(s('age')); const condition = s('condition')
  const condMult = condition === 'mint' ? 0.85 : condition === 'good' ? 0.7 : condition === 'fair' ? 0.5 : 0.3
  const ageMult = Math.max(0.1, 1 - age * 0.15)
  const value = original * condMult * ageMult
  return <div>
    <Input label="Original Price" k="original" ph="1500" unit="$" s={s} u={u} />
    <Input label="Age" k="age" ph="2" unit="years" s={s} u={u} />
    <Select label="Condition" k="condition" options={[['mint','Mint/Like New'],['good','Good'],['fair','Fair'],['poor','Poor']]} s={s} u={u} />
    {original > 0 && age >= 0 && condition && <Result>
      <h4>Estimated Value</h4>
      <p><strong>Fair Market Value:</strong> ${value.toFixed(0)}</p>
      <p><strong>Selling Range:</strong> ${(value * 0.85).toFixed(0)} — ${(value * 1.15).toFixed(0)}</p>
      <p><strong>Depreciation:</strong> {((1 - value/original) * 100).toFixed(0)}%</p>
    </Result>}
  </div>
}

export function BlackFridayTracker() {
  const categories = [
    { name: '65" 4K TVs', normal: '$1,200-2,500', bf: '$799-1,799', savings: '25-40%' },
    { name: '75" 4K TVs', normal: '$1,800-3,500', bf: '$1,199-2,499', savings: '25-35%' },
    { name: 'Soundbars', normal: '$200-1,200', bf: '$149-899', savings: '20-30%' },
    { name: 'AV Receivers', normal: '$400-2,000', bf: '$299-1,599', savings: '15-25%' },
    { name: 'Streaming Devices', normal: '$30-200', bf: '$18-150', savings: '25-50%' },
  ]
  return <div>
    <Result>
      <h4>Black Friday Price History</h4>
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead><tr style={{ borderBottom: '2px solid #dee2e6' }}><th className="text-left p-2">Category</th><th className="p-2">Normal</th><th className="p-2">BF Price</th><th className="p-2">Savings</th></tr></thead>
        <tbody>{categories.map(c => (
          <tr key={c.name} style={{ borderBottom: '1px solid #2a2a4e' }}>
            <td className="p-2">{c.name}</td><td className="p-2 text-center">{c.normal}</td>
            <td className="p-2 text-center text-green-500 font-semibold">{c.bf}</td><td className="p-2 text-center">{c.savings}</td>
          </tr>
        ))}</tbody>
      </table>
    </Result>
  </div>
}

export function WarrantyComparison() {
  const { s, u } = useToolState()
  const price = N(s('price')); const extCost = N(s('extCost')); const failRate = N(s('failRate'), 5)
  const extValue = price * (failRate * 2 / 100)
  return <div>
    <Input label="Product Price" k="price" ph="1500" unit="$" s={s} u={u} />
    <Input label="Extended Warranty Cost" k="extCost" ph="200" unit="$" s={s} u={u} />
    <Input label="Estimated Failure Rate" k="failRate" ph="5" unit="% within warranty" s={s} u={u} />
    {price > 0 && extCost > 0 && <Result>
      <h4>Warranty Value Analysis</h4>
      <p><strong>Expected repair value:</strong> ${extValue.toFixed(0)}</p>
      <p><strong>Warranty cost:</strong> ${extCost}</p>
      <p><strong>Value ratio:</strong> {(extValue / extCost).toFixed(2)}x</p>
      <p><strong>Recommendation:</strong> {extValue > extCost ? '✅ Worth buying' : '❌ Skip — save the money'}</p>
    </Result>}
  </div>
}

export function EnergyStarCalculator() {
  const { s, u } = useToolState()
  const watts = N(s('watts')); const hrs = N(s('hrs'), 4); const category = s('category')
  const kwhYear = watts * hrs * 365 / 1000
  const benchmarks: Record<string, number> = { 'tv': 200, 'projector': 350, 'receiver': 400, 'soundbar': 100 }
  const benchmark = benchmarks[category] || 250
  const rating = kwhYear > 0 ? Math.min(100, Math.round((1 - (kwhYear - benchmark * 0.5) / (benchmark * 1.5)) * 100)) : 0
  return <div>
    <Select label="Equipment Type" k="category" options={[['tv','TV/Display'],['projector','Projector'],['receiver','AV Receiver'],['soundbar','Soundbar']]} s={s} u={u} />
    <Input label="Power Consumption" k="watts" ph="150" unit="watts" s={s} u={u} />
    <Input label="Daily Usage" k="hrs" ph="4" unit="hours" s={s} u={u} />
    {watts > 0 && <Result>
      <h4>Energy Efficiency Rating</h4>
      <div className="flex items-center gap-4 mb-3">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-extrabold text-xl" style={{ background: rating >= 70 ? '#4CAF50' : rating >= 40 ? '#FF9800' : '#f44336' }}>{rating}</div>
        <div><strong>{rating >= 70 ? 'Efficient' : rating >= 40 ? 'Average' : 'Inefficient'}</strong><br/><span className="text-sm text-gray-400">{kwhYear.toFixed(0)} kWh/year</span></div>
      </div>
      <p><strong>Annual Energy Cost:</strong> ${(kwhYear * 0.12).toFixed(2)}</p>
      <p><strong>Category Average:</strong> ~{benchmark} kWh/year</p>
    </Result>}
  </div>
}
