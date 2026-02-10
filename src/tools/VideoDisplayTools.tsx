import { N, useToolState, Input, Select, Result } from './shared'

export function ResolutionComparison() {
  const { s, u } = useToolState()
  const dist = N(s('dist')); const size = N(s('size'))
  const ppi1080 = size > 0 ? Math.sqrt(1920**2 + 1080**2) / size : 0
  const ppi4k = ppi1080 * 2; const ppi8k = ppi1080 * 4
  const arcmin1080 = dist > 0 && ppi1080 > 0 ? 2 * Math.atan(1 / (2 * ppi1080 * dist * 12)) * 180 / Math.PI * 60 : 0
  return <div>
    <Input label="Screen Size" k="size" ph="65" unit="inches diagonal" s={s} u={u} />
    <Input label="Viewing Distance" k="dist" ph="8" unit="feet" s={s} u={u} />
    {size > 0 && dist > 0 && <Result>
      <h4>Resolution Comparison at {dist}' from {size}"</h4>
      <p><strong>1080p:</strong> {ppi1080.toFixed(1)} PPI — {arcmin1080 > 1 ? '👁️ Pixels visible' : '✅ Pixels not visible'}</p>
      <p><strong>4K:</strong> {ppi4k.toFixed(1)} PPI — {arcmin1080 / 2 > 1 ? '👁️ May see improvement' : '✅ Beyond human acuity'}</p>
      <p><strong>8K:</strong> {ppi8k.toFixed(1)} PPI — {arcmin1080 / 4 > 1 ? '👁️ May see improvement' : '✅ Well beyond human acuity'}</p>
    </Result>}
  </div>
}

export function HdrFormatChecker() {
  const { s, u } = useToolState()
  const format = s('format')
  const formats: Record<string, [string, string, string]> = {
    'hdr10': ['HDR10: Static metadata, 10-bit, open standard', 'All 4K TVs, all 4K Blu-ray, most streaming', 'Max brightness: 1,000-4,000 nits'],
    'hdr10plus': ['HDR10+: Dynamic metadata, 10-bit, Samsung-led', 'Samsung, Panasonic, Amazon Video', 'Scene-by-scene tone mapping'],
    'dolbyvision': ['Dolby Vision: Dynamic metadata, up to 12-bit', 'LG, Sony, TCL, Netflix, Disney+, Apple TV+', 'Best dynamic range, most widely supported premium format'],
    'hlg': ['HLG: Hybrid Log-Gamma, broadcast standard', 'All modern 4K TVs, BBC, YouTube', 'Backward compatible with SDR'],
  }
  return <div>
    <Select label="HDR Format" k="format" options={[['hdr10','HDR10'],['hdr10plus','HDR10+'],['dolbyvision','Dolby Vision'],['hlg','HLG']]} s={s} u={u} />
    {format && formats[format] && <Result>
      <h4>HDR Format Details</h4>
      <p><strong>{formats[format][0]}</strong></p>
      <p><strong>Supported by:</strong> {formats[format][1]}</p>
      <p><strong>Advantage:</strong> {formats[format][2]}</p>
    </Result>}
  </div>
}

export function RefreshRateCalculator() {
  const { s, u } = useToolState()
  const content = s('content')
  const recs: Record<string, [string, string]> = {
    'movies': ['120Hz (evenly divides 24fps with 5:5 pulldown)', '60Hz works fine with 3:2 pulldown. 24Hz native mode is best if available.'],
    'tv': ['120Hz for sports (motion interpolation), 60Hz minimum', 'For sports, look for TVs with good motion handling.'],
    'gaming': ['120Hz minimum, 144Hz for competitive', 'Ensure HDMI 2.1 for 4K/120Hz. Look for VRR support.'],
    'mixed': ['120Hz — best all-around', 'Handles movies (24×5), sports (60×2), and gaming.'],
  }
  return <div>
    <Select label="Primary Content Type" k="content" options={[['movies','Movies (24fps)'],['tv','TV/Sports (30/60fps)'],['gaming','Gaming'],['mixed','Mixed Use']]} s={s} u={u} />
    {content && recs[content] && <Result>
      <h4>Refresh Rate Recommendation</h4>
      <p><strong>Ideal:</strong> {recs[content][0]}</p>
      <p>{recs[content][1]}</p>
    </Result>}
  </div>
}

export function ColorSpaceVisualizer() {
  return <div>
    <Result>
      <h4>Color Space Comparison</h4>
      <div className="flex gap-4 flex-wrap">
        {[
          { name: 'sRGB', pct: 100, color: '#4CAF50', coverage: '33.3% of visible spectrum' },
          { name: 'DCI-P3', pct: 126, color: '#0077FF', coverage: '45.5% of visible spectrum' },
          { name: 'Rec.2020', pct: 172, color: '#9C27B0', coverage: '75.8% of visible spectrum' },
        ].map(cs => (
          <div key={cs.name} className="flex-1 text-center" style={{ minWidth: 120 }}>
            <div className="rounded-lg mx-auto mb-2 opacity-70" style={{ width: `${cs.pct * 0.55}%`, height: 80, background: cs.color, minWidth: 60 }} />
            <strong>{cs.name}</strong>
            <p className="text-xs text-gray-400">{cs.coverage}</p>
          </div>
        ))}
      </div>
      <p className="mt-4"><strong>For movies:</strong> DCI-P3 is the cinema standard. Prioritize 98%+ DCI-P3 coverage.</p>
    </Result>
  </div>
}

export function InputLagDatabase() {
  const { s, u } = useToolState()
  const devices = [
    { name: 'LG C4 OLED', lag: '5.2ms', gaming: '✅ Excellent' },
    { name: 'Samsung S95D QD-OLED', lag: '5.5ms', gaming: '✅ Excellent' },
    { name: 'Samsung QN90D QLED', lag: '5.8ms', gaming: '✅ Excellent' },
    { name: 'Sony A95L OLED', lag: '8.5ms', gaming: '✅ Great' },
    { name: 'TCL QM8 Mini LED', lag: '6.5ms', gaming: '✅ Excellent' },
    { name: 'Hisense U8N', lag: '7.0ms', gaming: '✅ Great' },
    { name: 'Epson LS800 Projector', lag: '16.7ms', gaming: '✅ Good' },
    { name: 'BenQ TK860i Projector', lag: '16.0ms', gaming: '✅ Good' },
  ]
  const q = s('q').toLowerCase()
  const filtered = q ? devices.filter(d => d.name.toLowerCase().includes(q)) : devices
  return <div>
    <div className="mb-3">
      <label className="tool-label">Search Device</label>
      <input className="tool-input" placeholder="e.g., LG, Samsung..." value={s('q')} onChange={e => u('q', e.target.value)} />
    </div>
    <Result>
      <h4>Input Lag Database</h4>
      <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
        <thead><tr style={{ borderBottom: '2px solid #dee2e6' }}><th className="text-left p-2">Device</th><th className="p-2">Input Lag</th><th className="p-2">Gaming</th></tr></thead>
        <tbody>{filtered.map(d => (
          <tr key={d.name} style={{ borderBottom: '1px solid #2a2a4e' }}><td className="p-2">{d.name}</td><td className="p-2 text-center">{d.lag}</td><td className="p-2 text-center">{d.gaming}</td></tr>
        ))}</tbody>
      </table>
    </Result>
  </div>
}

export function ContrastRatioCalculator() {
  const { s, u } = useToolState()
  const bright = N(s('bright')); const dark = N(s('dark'))
  const ratio = dark > 0 ? bright / dark : 0
  return <div>
    <Input label="Brightest White" k="bright" ph="500" unit="cd/m² (nits)" s={s} u={u} />
    <Input label="Darkest Black" k="dark" ph="0.05" unit="cd/m² (nits)" s={s} u={u} />
    {ratio > 0 && <Result>
      <h4>Contrast Ratio</h4>
      <p><strong>Contrast Ratio:</strong> {ratio.toFixed(0)}:1</p>
      <p><strong>ANSI Contrast:</strong> ~{(ratio * 0.5).toFixed(0)}:1 (estimated)</p>
      <p><strong>Rating:</strong> {ratio > 50000 ? '🌟 Exceptional (OLED-level)' : ratio > 5000 ? '✅ Excellent' : ratio > 2000 ? '👍 Good' : '⚠️ Average'}</p>
    </Result>}
  </div>
}

export function ProjectorLumensCalculator() {
  const { s, u } = useToolState()
  const screen = N(s('screen')); const ambient = s('ambient')
  const area = screen > 0 ? (screen * 0.872 / 12) * (screen * 0.49 / 12) : 0
  const ftlNeeded = ambient === 'dark' ? 14 : ambient === 'dim' ? 25 : ambient === 'moderate' ? 40 : 50
  const lumens = area * ftlNeeded
  return <div>
    <Input label="Screen Size" k="screen" ph="120" unit="inches diagonal" s={s} u={u} />
    <Select label="Room Lighting" k="ambient" options={[['dark','Dark Room'],['dim','Dim'],['moderate','Moderate Ambient'],['bright','Bright Room']]} s={s} u={u} />
    {screen > 0 && ambient && <Result>
      <h4>Required Projector Lumens</h4>
      <p><strong>Screen Area:</strong> {area.toFixed(1)} sq ft</p>
      <p><strong>Target:</strong> {ftlNeeded} ft-Lamberts</p>
      <p><strong>Minimum:</strong> {lumens.toFixed(0)} ANSI lumens</p>
      <p><strong>Recommended:</strong> {(lumens * 1.3).toFixed(0)} ANSI lumens</p>
    </Result>}
  </div>
}

export function TvCalibrationGuide() {
  return <div>
    <Result>
      <h4>TV Calibration Guide — Quick Settings</h4>
      <div className="leading-7 text-sm">
        <p><strong>1. Picture Mode:</strong> Cinema/Movie/Filmmaker Mode</p>
        <p><strong>2. Backlight/OLED Light:</strong> Set to taste</p>
        <p><strong>3. Contrast:</strong> 95-100%</p>
        <p><strong>4. Brightness:</strong> 50% (adjusts black level)</p>
        <p><strong>5. Sharpness:</strong> 0-10%</p>
        <p><strong>6. Color:</strong> 50% (default in Movie mode)</p>
        <p><strong>7. Color Temperature:</strong> Warm/Warm2 (D65)</p>
        <p><strong>8. Motion Smoothing:</strong> OFF for movies</p>
        <p><strong>9. HDR:</strong> Enable "Enhanced" on all HDMI ports</p>
        <p><strong>10. Game Mode:</strong> Enable only when gaming</p>
      </div>
    </Result>
  </div>
}

export function GamingModeChecker() {
  const { s, u } = useToolState()
  const lag = N(s('lag')); const vrr = s('vrr'); const hdmi = s('hdmi'); const hz = N(s('hz'))
  const score = (lag > 0 ? Math.max(0, 30 - lag) / 30 * 40 : 0) + (vrr === 'yes' ? 20 : 0) + (hdmi === '2.1' ? 20 : hdmi === '2.0' ? 10 : 0) + (hz >= 120 ? 20 : hz >= 60 ? 10 : 0)
  return <div>
    <Input label="Input Lag" k="lag" ph="10" unit="ms (game mode)" s={s} u={u} />
    <Select label="VRR Support" k="vrr" options={[['yes','Yes (VRR/FreeSync/G-Sync)'],['no','No']]} s={s} u={u} />
    <Select label="HDMI Version" k="hdmi" options={[['2.1','HDMI 2.1'],['2.0','HDMI 2.0'],['1.4','HDMI 1.4']]} s={s} u={u} />
    <Input label="Max Refresh Rate" k="hz" ph="120" unit="Hz" s={s} u={u} />
    {(lag > 0 || vrr || hdmi) && <Result>
      <h4>Gaming Suitability Score</h4>
      <div className="flex items-center gap-4 mb-3">
        <div className="text-4xl font-extrabold" style={{ color: score >= 80 ? '#4CAF50' : score >= 50 ? '#FF9800' : '#f44336' }}>{score.toFixed(0)}</div>
        <div className="text-lg font-semibold">/100 — {score >= 80 ? 'Excellent for Gaming' : score >= 50 ? 'Good for Casual Gaming' : 'Not Ideal'}</div>
      </div>
      {lag > 0 && <p>Input Lag: {lag}ms — {lag <= 10 ? '✅ Excellent' : lag <= 20 ? '👍 Good' : '⚠️ Noticeable'}</p>}
    </Result>}
  </div>
}

export function BurnInRiskCalculator() {
  const { s, u } = useToolState()
  const hrs = N(s('hrs')); const static_pct = N(s('static')); const brightness = N(s('brightness'), 50)
  const risk = hrs * static_pct / 100 * brightness / 50
  return <div>
    <Input label="Daily TV Usage" k="hrs" ph="6" unit="hours" s={s} u={u} />
    <Input label="Static Content %" k="static" ph="30" unit="% (news tickers, HUDs, logos)" s={s} u={u} />
    <Input label="Brightness Level" k="brightness" ph="50" unit="% of max" s={s} u={u} />
    {hrs > 0 && <Result>
      <h4>OLED Burn-In Risk Assessment</h4>
      <div className="text-2xl font-extrabold mb-2" style={{ color: risk > 300 ? '#f44336' : risk > 100 ? '#FF9800' : '#4CAF50' }}>
        {risk > 300 ? '⚠️ High Risk' : risk > 100 ? '⚡ Moderate Risk' : '✅ Low Risk'}
      </div>
      <p><strong>Risk Score:</strong> {risk.toFixed(0)}</p>
      <p><strong>Estimated safe period:</strong> {risk > 300 ? '2-3 years' : risk > 100 ? '4-6 years' : '7+ years'}</p>
      <p className="text-sm text-gray-400">Modern OLEDs (2024+) have significantly improved burn-in resistance.</p>
    </Result>}
  </div>
}
