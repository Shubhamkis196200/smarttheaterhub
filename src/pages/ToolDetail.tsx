import { useParams, Link } from 'react-router-dom'
import { tools } from '../data/tools'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

function N(v: string, d = 0) { const n = parseFloat(v); return isNaN(n) ? d : n }

function ToolEngine({ slug }: { slug: string }) {
  const [v, setV] = useState<Record<string, string>>({})
  const s = (k: string) => v[k] || ''
  const u = (k: string, val: string) => setV(p => ({ ...p, [k]: val }))
  const Input = ({ label, k, ph, unit }: { label: string; k: string; ph?: string; unit?: string }) => (
    <div style={{ marginBottom: '0.75rem' }}>
      <label className="tool-label">{label} {unit && <span style={{ fontWeight: 400, color: '#6c757d' }}>({unit})</span>}</label>
      <input className="tool-input" placeholder={ph || ''} value={s(k)} onChange={e => u(k, e.target.value)} type="number" />
    </div>
  )
  const Select = ({ label, k, options }: { label: string; k: string; options: [string, string][] }) => (
    <div style={{ marginBottom: '0.75rem' }}>
      <label className="tool-label">{label}</label>
      <select className="tool-input" value={s(k)} onChange={e => u(k, e.target.value)}>
        <option value="">Select...</option>
        {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
      </select>
    </div>
  )
  const Result = ({ children }: { children: React.ReactNode }) => <div className="tool-result">{children}</div>

  switch (slug) {
    case 'screen-size-calculator': {
      const dist = N(s('dist'))
      const thx = dist > 0 ? (dist * 12) / 1.2 : 0 // THX: viewing angle ~36°
      const smpte = dist > 0 ? (dist * 12) / 1.6 : 0 // SMPTE: ~30°
      return <div>
        <Input label="Viewing Distance" k="dist" ph="10" unit="feet" />
        {dist > 0 && <Result>
          <h4>Recommended Screen Sizes</h4>
          <p><strong>THX Recommended (36° viewing angle):</strong> {thx.toFixed(0)}" diagonal</p>
          <p><strong>SMPTE Recommended (30° viewing angle):</strong> {smpte.toFixed(0)}" diagonal</p>
          <p><strong>Good Range:</strong> {(smpte * 0.85).toFixed(0)}" to {(thx * 1.05).toFixed(0)}" diagonal</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6c757d' }}>THX recommends a 36° viewing angle for an immersive cinema experience. SMPTE recommends 30° for a comfortable viewing experience. Most people prefer somewhere in between.</p>
        </Result>}
      </div>
    }
    case 'projector-throw-distance': {
      const screen = N(s('screen')); const ratio = N(s('ratio'), 1.5)
      const dist = screen > 0 ? (screen * ratio) / 12 : 0
      return <div>
        <Input label="Screen Size (diagonal)" k="screen" ph="120" unit="inches" />
        <Input label="Throw Ratio" k="ratio" ph="1.5" />
        <p style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '0.75rem' }}>Typical throw ratios: Short throw 0.4-0.8, Standard 1.2-2.0, Long throw 2.0+</p>
        {screen > 0 && <Result>
          <h4>Projector Placement</h4>
          <p><strong>Required Distance:</strong> {dist.toFixed(1)} feet ({(dist * 12).toFixed(0)} inches)</p>
          <p><strong>Screen Width (16:9):</strong> {(screen * 0.872).toFixed(1)}" × {(screen * 0.49).toFixed(1)}"</p>
        </Result>}
      </div>
    }
    case 'speaker-placement-guide': {
      const l = N(s('l')); const w = N(s('w')); const config = s('config') || '5.1'
      return <div>
        <Input label="Room Length" k="l" ph="20" unit="feet" />
        <Input label="Room Width" k="w" ph="15" unit="feet" />
        <Select label="Configuration" k="config" options={[['5.1','5.1 Surround'],['7.1','7.1 Surround'],['5.1.2','5.1.2 Atmos'],['7.1.4','7.1.4 Atmos']]} />
        {l > 0 && w > 0 && <Result>
          <h4>Speaker Positions for {config || '5.1'} — {l}' × {w}' Room</h4>
          <p><strong>Front L/R:</strong> {(w * 0.35).toFixed(1)}' from center, {(l * 0.15).toFixed(1)}' from front wall</p>
          <p><strong>Center:</strong> Centered, at screen level</p>
          <p><strong>Subwoofer:</strong> {(l * 0.38).toFixed(1)}' along front wall from corner</p>
          <p><strong>Side Surrounds:</strong> {(l * 0.55).toFixed(1)}' from front wall, at ear level + 2ft</p>
          {(config === '7.1' || config === '7.1.4') && <p><strong>Rear Surrounds:</strong> {(l * 0.75).toFixed(1)}' from front wall, {(w * 0.25).toFixed(1)}' from side walls</p>}
          {(config === '5.1.2' || config === '7.1.4') && <>
            <p><strong>Front Heights:</strong> Ceiling, {(l * 0.25).toFixed(1)}' from front wall</p>
            {config === '7.1.4' && <p><strong>Rear Heights:</strong> Ceiling, {(l * 0.7).toFixed(1)}' from front wall</p>}
          </>}
          <p><strong>Listening Position:</strong> {(l * 0.38).toFixed(1)}' from front wall (38% of room length)</p>
        </Result>}
      </div>
    }
    case 'room-acoustics-calculator': {
      const l = N(s('l')); const w = N(s('w')); const h = N(s('h'))
      const c = 1130 // speed of sound ft/s
      const modes = l > 0 && w > 0 && h > 0 ? {
        lengthModes: [1,2,3].map(n => (n * c / (2 * l)).toFixed(1)),
        widthModes: [1,2,3].map(n => (n * c / (2 * w)).toFixed(1)),
        heightModes: [1,2,3].map(n => (n * c / (2 * h)).toFixed(1)),
        volume: l * w * h,
        rt60est: 0.05 * (l * w * h) ** (1/3)
      } : null
      return <div>
        <Input label="Room Length" k="l" ph="20" unit="feet" />
        <Input label="Room Width" k="w" ph="15" unit="feet" />
        <Input label="Room Height" k="h" ph="8" unit="feet" />
        {modes && <Result>
          <h4>Room Acoustic Analysis</h4>
          <p><strong>Room Volume:</strong> {modes.volume.toFixed(0)} ft³</p>
          <p><strong>Estimated RT60:</strong> {modes.rt60est.toFixed(2)}s (untreated)</p>
          <p style={{ marginTop: '0.5rem' }}><strong>Length Modes:</strong> {modes.lengthModes.join(' Hz, ')} Hz</p>
          <p><strong>Width Modes:</strong> {modes.widthModes.join(' Hz, ')} Hz</p>
          <p><strong>Height Modes:</strong> {modes.heightModes.join(' Hz, ')} Hz</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6c757d' }}>
            {modes.volume < 1500 ? 'Small room — bass management is critical. Consider dual subwoofers and extensive bass trapping.' :
             modes.volume < 3000 ? 'Medium room — good for home theater. Standard acoustic treatment recommended.' :
             'Large room — excellent for theater. May need additional amplification power.'}
          </p>
        </Result>}
      </div>
    }
    case 'seating-distance-calculator': {
      const screen = N(s('screen'))
      return <div>
        <Input label="Screen Size (diagonal)" k="screen" ph="65" unit="inches" />
        {screen > 0 && <Result>
          <h4>Recommended Viewing Distance</h4>
          <p><strong>THX (immersive):</strong> {(screen / 12 * 1.2).toFixed(1)} feet</p>
          <p><strong>SMPTE (comfortable):</strong> {(screen / 12 * 1.6).toFixed(1)} feet</p>
          <p><strong>4K detail threshold:</strong> {(screen / 12 * 1.0).toFixed(1)} feet — closer and you won't resolve extra detail</p>
          <p><strong>Recommended range:</strong> {(screen / 12 * 1.2).toFixed(1)} — {(screen / 12 * 1.6).toFixed(1)} feet</p>
        </Result>}
      </div>
    }
    case 'subwoofer-placement': {
      const l = N(s('l')); const w = N(s('w')); const subs = N(s('subs'), 1)
      return <div>
        <Input label="Room Length" k="l" ph="20" unit="feet" />
        <Input label="Room Width" k="w" ph="15" unit="feet" />
        <Select label="Number of Subwoofers" k="subs" options={[['1','1 Subwoofer'],['2','2 Subwoofers'],['4','4 Subwoofers']]} />
        {l > 0 && w > 0 && <Result>
          <h4>Optimal Subwoofer Positions</h4>
          {(subs === 1 || !subs) && <>
            <p><strong>Position 1 (front wall):</strong> {(w * 0.38).toFixed(1)}' from left wall, on the floor along front wall</p>
            <p><strong>Position 2 (corner):</strong> Front-left corner — maximum output, less even response</p>
            <p><strong>Position 3 (midwall):</strong> {(l * 0.5).toFixed(1)}' along a side wall — smoothest single-sub response</p>
          </>}
          {subs >= 2 && <>
            <p><strong>Sub 1:</strong> Front wall, {(w * 0.5).toFixed(1)}' from left wall (centered)</p>
            <p><strong>Sub 2:</strong> Back wall, {(w * 0.5).toFixed(1)}' from left wall (centered)</p>
            <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.5rem' }}>Opposing wall placement cancels length-wise room modes for even bass at all seats.</p>
          </>}
          {subs >= 4 && <>
            <p><strong>Sub 3:</strong> Left wall, {(l * 0.5).toFixed(1)}' from front wall</p>
            <p><strong>Sub 4:</strong> Right wall, {(l * 0.5).toFixed(1)}' from front wall</p>
            <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>4 subs at midpoints of each wall provides the most even bass distribution.</p>
          </>}
        </Result>}
      </div>
    }
    case 'aspect-ratio-calculator': {
      const w = N(s('w')); const h = N(s('h'))
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
      const rw = Math.round(w), rh = Math.round(h)
      const g = rw > 0 && rh > 0 ? gcd(rw, rh) : 1
      return <div>
        <Input label="Width" k="w" ph="1920" unit="pixels" />
        <Input label="Height" k="h" ph="1080" unit="pixels" />
        {w > 0 && h > 0 && <Result>
          <h4>Aspect Ratio Results</h4>
          <p><strong>Aspect Ratio:</strong> {rw/g}:{rh/g} ({(w/h).toFixed(2)}:1)</p>
          <p><strong>Total Pixels:</strong> {(w * h / 1000000).toFixed(2)} megapixels</p>
          <p><strong>Diagonal:</strong> {Math.sqrt(w*w + h*h).toFixed(0)} pixels</p>
          <p><strong>Common match:</strong> {w/h > 2.3 ? '21:9 Ultrawide' : w/h > 1.7 ? '16:9 Widescreen' : w/h > 1.5 ? '16:10 Wide' : '4:3 Standard'}</p>
        </Result>}
      </div>
    }
    case 'screen-gain-calculator': {
      const lumens = N(s('lumens')); const screen = N(s('screen')); const ambient = N(s('ambient'))
      const area = screen > 0 ? (screen * 0.872 / 12) * (screen * 0.49 / 12) : 0
      const ftl = lumens > 0 && area > 0 ? lumens / area : 0
      return <div>
        <Input label="Projector Lumens" k="lumens" ph="2500" unit="ANSI lumens" />
        <Input label="Screen Size" k="screen" ph="120" unit="inches diagonal" />
        <Select label="Ambient Light" k="ambient" options={[['0','Dark room (0 lux)'],['50','Dim room (50 lux)'],['150','Moderate light (150 lux)'],['300','Bright room (300 lux)']]} />
        {lumens > 0 && screen > 0 && <Result>
          <h4>Screen Gain Recommendation</h4>
          <p><strong>Screen Area:</strong> {area.toFixed(1)} sq ft</p>
          <p><strong>Foot-Lamberts (gain 1.0):</strong> {ftl.toFixed(1)} fL</p>
          <p><strong>Recommended Gain:</strong> {ambient <= 50 ? '1.0 — 1.3 (matte white)' : ambient <= 150 ? '1.3 — 1.8 (high contrast gray)' : '2.0+ (ALR ambient light rejecting)'}</p>
          <p><strong>Target fL:</strong> {ambient <= 50 ? '12-16 fL (cinema reference)' : '20-30 fL (ambient light viewing)'}</p>
        </Result>}
      </div>
    }
    case 'cable-length-calculator': {
      const x1 = N(s('x1')); const y1 = N(s('y1')); const x2 = N(s('x2')); const y2 = N(s('y2'))
      const straight = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
      return <div>
        <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '1rem' }}>Enter positions in feet from a corner of the room</p>
        <div className="grid-2">
          <div><Input label="Device 1 — X Position" k="x1" ph="0" unit="feet" /></div>
          <div><Input label="Device 1 — Y Position" k="y1" ph="0" unit="feet" /></div>
          <div><Input label="Device 2 — X Position" k="x2" ph="10" unit="feet" /></div>
          <div><Input label="Device 2 — Y Position" k="y2" ph="8" unit="feet" /></div>
        </div>
        {(x1 || y1 || x2 || y2) ? <Result>
          <h4>Cable Length Needed</h4>
          <p><strong>Straight line:</strong> {straight.toFixed(1)} feet</p>
          <p><strong>Along walls (add slack):</strong> {(Math.abs(x2-x1) + Math.abs(y2-y1) + 3).toFixed(1)} feet</p>
          <p><strong>Recommended purchase:</strong> {(Math.ceil((Math.abs(x2-x1) + Math.abs(y2-y1) + 3) / 3) * 3)} foot cable</p>
        </Result> : null}
      </div>
    }
    case 'hdmi-bandwidth-calculator': {
      const res = s('res'); const fps = N(s('fps'), 60); const hdr = s('hdr')
      const bwMap: Record<string, number> = { '1080p': 1920*1080, '4k': 3840*2160, '8k': 7680*4320 }
      const pixels = bwMap[res] || 0
      const bpp = hdr === 'yes' ? 36 : 24
      const bw = pixels * fps * bpp / 1e9
      return <div>
        <Select label="Resolution" k="res" options={[['1080p','1080p'],['4k','4K'],['8k','8K']]} />
        <Input label="Frame Rate" k="fps" ph="60" unit="fps" />
        <Select label="HDR" k="hdr" options={[['no','No (8-bit)'],['yes','Yes (10/12-bit)']]} />
        {res && <Result>
          <h4>HDMI Requirements</h4>
          <p><strong>Bandwidth Needed:</strong> {bw.toFixed(1)} Gbps</p>
          <p><strong>Required HDMI Version:</strong> {bw <= 10.2 ? 'HDMI 1.4' : bw <= 18 ? 'HDMI 2.0' : bw <= 48 ? 'HDMI 2.1' : 'HDMI 2.1 with DSC'}</p>
          <p><strong>Cable Type:</strong> {bw <= 18 ? 'Standard High Speed HDMI' : 'Ultra High Speed HDMI (48Gbps certified)'}</p>
        </Result>}
      </div>
    }
    case 'power-consumption-calculator': {
      const tv = N(s('tv'), 0); const avr = N(s('avr'), 0); const sub = N(s('sub'), 0)
      const other = N(s('other'), 0); const hrs = N(s('hrs'), 4); const rate = N(s('rate'), 0.12)
      const total = tv + avr + sub + other
      const annual = total * hrs * 365 / 1000 * rate
      return <div>
        <Input label="TV/Projector" k="tv" ph="150" unit="watts" />
        <Input label="AV Receiver" k="avr" ph="200" unit="watts" />
        <Input label="Subwoofer(s)" k="sub" ph="100" unit="watts" />
        <Input label="Other Devices" k="other" ph="50" unit="watts" />
        <Input label="Daily Usage" k="hrs" ph="4" unit="hours" />
        <Input label="Electricity Rate" k="rate" ph="0.12" unit="$/kWh" />
        {total > 0 && <Result>
          <h4>Power Consumption</h4>
          <p><strong>Total Watts:</strong> {total}W</p>
          <p><strong>Daily kWh:</strong> {(total * (hrs || 4) / 1000).toFixed(2)} kWh</p>
          <p><strong>Annual Cost:</strong> ${annual.toFixed(2)}/year</p>
          <p><strong>Monthly Cost:</strong> ${(annual/12).toFixed(2)}/month</p>
        </Result>}
      </div>
    }
    case 'btu-calculator': {
      const l = N(s('l')); const w = N(s('w')); const h = N(s('h')); const equip = N(s('equip'))
      const vol = l * w * h; const btu = vol > 0 ? vol * 4 + equip * 3.41 : 0
      return <div>
        <Input label="Room Length" k="l" ph="20" unit="feet" />
        <Input label="Room Width" k="w" ph="15" unit="feet" />
        <Input label="Room Height" k="h" ph="8" unit="feet" />
        <Input label="Total Equipment Watts" k="equip" ph="500" unit="watts" />
        {vol > 0 && <Result>
          <h4>Cooling Requirements</h4>
          <p><strong>Room Volume:</strong> {vol.toFixed(0)} ft³</p>
          <p><strong>Base BTU (room):</strong> {(vol * 4).toFixed(0)} BTU/hr</p>
          <p><strong>Equipment Heat:</strong> {(equip * 3.41).toFixed(0)} BTU/hr</p>
          <p><strong>Total BTU Needed:</strong> {btu.toFixed(0)} BTU/hr</p>
          <p><strong>AC Tonnage:</strong> {(btu / 12000).toFixed(1)} tons</p>
        </Result>}
      </div>
    }
    case 'wire-gauge-calculator': {
      const watts = N(s('watts')); const impedance = N(s('impedance'), 8); const dist = N(s('dist'))
      const amps = watts > 0 && impedance > 0 ? Math.sqrt(watts / impedance) : 0
      const _resistance = amps > 0 ? impedance * 0.05 : 0 // 5% max loss
      return <div>
        <Input label="Amplifier Power" k="watts" ph="100" unit="watts/channel" />
        <Input label="Speaker Impedance" k="impedance" ph="8" unit="ohms" />
        <Input label="Cable Run Distance" k="dist" ph="25" unit="feet (one way)" />
        {watts > 0 && dist > 0 && <Result>
          <h4>Wire Gauge Recommendation</h4>
          <p><strong>Current:</strong> {amps.toFixed(2)} amps peak</p>
          <p><strong>Recommended:</strong> {dist <= 25 ? '16 AWG' : dist <= 50 ? '14 AWG' : dist <= 100 ? '12 AWG' : '10 AWG'}</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>For runs over 50 feet, thicker wire prevents power loss. Use 12 AWG or thicker for long runs.</p>
        </Result>}
      </div>
    }
    case 'mounting-height-calculator': {
      const screen = N(s('screen')); const seatingH = N(s('seatingH'), 42)
      const screenH = screen > 0 ? screen * 0.49 : 0
      const center = seatingH + (screenH / 2)
      const bottomEdge = seatingH - 2
      return <div>
        <Input label="Screen Size" k="screen" ph="65" unit="inches diagonal" />
        <Input label="Seated Eye Height" k="seatingH" ph="42" unit="inches from floor" />
        {screen > 0 && <Result>
          <h4>Mounting Height</h4>
          <p><strong>Screen Height:</strong> {screenH.toFixed(1)}" tall</p>
          <p><strong>Center of screen at:</strong> {center.toFixed(0)}" from floor</p>
          <p><strong>Bottom edge at:</strong> {bottomEdge.toFixed(0)}" from floor</p>
          <p><strong>Mount center point:</strong> {center.toFixed(0)}" from floor</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>The center of the screen should be at seated eye level (±5°) for comfortable viewing.</p>
        </Result>}
      </div>
    }
    case 'room-volume-calculator': {
      const l = N(s('l')); const w = N(s('w')); const h = N(s('h'))
      const vol = l * w * h
      return <div>
        <Input label="Length" k="l" ph="20" unit="feet" />
        <Input label="Width" k="w" ph="15" unit="feet" />
        <Input label="Height" k="h" ph="8" unit="feet" />
        {vol > 0 && <Result>
          <h4>Room Volume & Treatment</h4>
          <p><strong>Volume:</strong> {vol.toFixed(0)} ft³ ({(vol * 0.0283).toFixed(1)} m³)</p>
          <p><strong>Floor Area:</strong> {(l*w).toFixed(0)} ft²</p>
          <p><strong>Surface Area:</strong> {(2*(l*w + l*h + w*h)).toFixed(0)} ft²</p>
          <p><strong>Room Size:</strong> {vol < 1000 ? 'Small' : vol < 2500 ? 'Medium' : 'Large'}</p>
          <p><strong>Recommended Treatment:</strong> {vol < 1000 ? '8-12 panels + 4 bass traps' : vol < 2500 ? '12-16 panels + 4-8 bass traps' : '16-24 panels + 8 bass traps'}</p>
        </Result>}
      </div>
    }
    case 'speaker-impedance-calculator': {
      const z1 = N(s('z1')); const z2 = N(s('z2')); const mode = s('mode') || 'series'
      const series = z1 + z2; const parallel = z1 > 0 && z2 > 0 ? (z1 * z2) / (z1 + z2) : 0
      return <div>
        <Input label="Speaker 1 Impedance" k="z1" ph="8" unit="ohms" />
        <Input label="Speaker 2 Impedance" k="z2" ph="8" unit="ohms" />
        <Select label="Wiring" k="mode" options={[['series','Series'],['parallel','Parallel']]} />
        {z1 > 0 && z2 > 0 && <Result>
          <h4>Total Impedance</h4>
          <p><strong>Series:</strong> {series.toFixed(1)}Ω (safe for all amplifiers)</p>
          <p><strong>Parallel:</strong> {parallel.toFixed(1)}Ω {parallel < 4 ? '⚠️ May damage some amplifiers' : '✅ Safe'}</p>
          <p><strong>Your Selection ({mode || 'series'}):</strong> {mode === 'parallel' ? parallel.toFixed(1) : series.toFixed(1)}Ω</p>
        </Result>}
      </div>
    }
    case 'amplifier-power-calculator': {
      const _vol = N(s('vol')); const sens = N(s('sens'), 88); const level = N(s('level'), 85)
      const dist = N(s('dist'), 10)
      const dbNeeded = level - sens + 20 * Math.log10(dist / 3.28)
      const watts = Math.pow(10, dbNeeded / 10)
      return <div>
        <Input label="Room Volume" k="vol" ph="2400" unit="ft³" />
        <Input label="Speaker Sensitivity" k="sens" ph="88" unit="dB/1W/1m" />
        <Input label="Desired Listening Level" k="level" ph="85" unit="dB" />
        <Input label="Listening Distance" k="dist" ph="10" unit="feet" />
        {sens > 0 && <Result>
          <h4>Amplifier Power Needed</h4>
          <p><strong>dB above 1W needed:</strong> {dbNeeded.toFixed(1)} dB</p>
          <p><strong>Minimum Power:</strong> {watts.toFixed(1)} watts/channel</p>
          <p><strong>Recommended (with headroom):</strong> {(watts * 3).toFixed(0)} watts/channel</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>3× headroom prevents clipping during dynamic peaks in movies.</p>
        </Result>}
      </div>
    }
    case 'crossover-frequency-calculator': {
      const low = N(s('low')); const driver = N(s('driver'))
      const xover = driver > 0 ? 1130 * 12 / (Math.PI * driver) : 0
      return <div>
        <Input label="Woofer Low-Freq Limit (-3dB)" k="low" ph="60" unit="Hz" />
        <Input label="Woofer Driver Diameter" k="driver" ph="6.5" unit="inches" />
        {driver > 0 && <Result>
          <h4>Crossover Point</h4>
          <p><strong>Calculated Crossover:</strong> {xover.toFixed(0)} Hz</p>
          <p><strong>Recommended Range:</strong> {(xover * 0.8).toFixed(0)} — {(xover * 1.2).toFixed(0)} Hz</p>
          <p><strong>Subwoofer Crossover:</strong> {low > 0 ? `${(low * 1.2).toFixed(0)} Hz (set sub to ${(low * 1.2).toFixed(0)} Hz)` : 'Enter woofer low limit'}</p>
        </Result>}
      </div>
    }
    case 'decibel-calculator': {
      const db1 = N(s('db1')); const db2 = N(s('db2'))
      const sum = 10 * Math.log10(Math.pow(10, db1/10) + Math.pow(10, db2/10))
      const dist1 = N(s('dist1')); const dist2 = N(s('dist2')); const splRef = N(s('splRef'))
      const splAtDist = splRef > 0 && dist1 > 0 && dist2 > 0 ? splRef - 20 * Math.log10(dist2 / dist1) : 0
      return <div>
        <h4 style={{ marginBottom: '1rem' }}>dB Addition</h4>
        <div className="grid-2">
          <Input label="Source 1" k="db1" ph="85" unit="dB" />
          <Input label="Source 2" k="db2" ph="85" unit="dB" />
        </div>
        {(db1 > 0 || db2 > 0) && <Result>
          <p><strong>Combined Level:</strong> {sum.toFixed(1)} dB</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>Two identical sources add +3 dB</p>
        </Result>}
        <h4 style={{ margin: '1.5rem 0 1rem' }}>Distance SPL</h4>
        <Input label="SPL at Reference Distance" k="splRef" ph="90" unit="dB" />
        <div className="grid-2">
          <Input label="Reference Distance" k="dist1" ph="1" unit="meters" />
          <Input label="Target Distance" k="dist2" ph="3" unit="meters" />
        </div>
        {splAtDist > 0 && <Result>
          <p><strong>SPL at {s('dist2')}m:</strong> {splAtDist.toFixed(1)} dB</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>SPL drops 6 dB per doubling of distance</p>
        </Result>}
      </div>
    }
    case 'audio-delay-calculator': {
      const dist = N(s('dist'))
      const delayMs = dist > 0 ? (dist / 1130) * 1000 : 0
      const delaySamples44 = dist > 0 ? delayMs / 1000 * 44100 : 0
      return <div>
        <Input label="Distance" k="dist" ph="10" unit="feet" />
        {dist > 0 && <Result>
          <h4>Audio Delay</h4>
          <p><strong>Time Delay:</strong> {delayMs.toFixed(2)} ms</p>
          <p><strong>Samples (44.1kHz):</strong> {delaySamples44.toFixed(0)}</p>
          <p><strong>Samples (48kHz):</strong> {(delayMs / 1000 * 48000).toFixed(0)}</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>Use this to set speaker delays in your AVR for distance compensation.</p>
        </Result>}
      </div>
    }
    case 'frequency-response-visualizer': {
      const low = N(s('low'), 40); const high = N(s('high'), 20000); const _sens = N(s('sens'), 88)
      return <div>
        <Input label="Low Frequency (-3dB)" k="low" ph="40" unit="Hz" />
        <Input label="High Frequency (-3dB)" k="high" ph="20000" unit="Hz" />
        <Input label="Sensitivity" k="sens" ph="88" unit="dB" />
        {low > 0 && <Result>
          <h4>Frequency Response Profile</h4>
          <div style={{ display: 'flex', alignItems: 'end', gap: 2, height: 100 }}>
            {[20,40,60,80,100,200,500,1000,2000,5000,10000,15000,20000].map(f => {
              const h = f >= low && f <= high ? 80 + (Math.random() * 10 - 5) : Math.max(20, 80 - Math.abs(f < low ? (low - f) / low : (f - high) / high) * 60)
              return <div key={f} style={{ flex: 1, background: f >= low && f <= high ? '#0077FF' : '#dee2e6', height: `${h}%`, borderRadius: '2px 2px 0 0', minWidth: 8 }} title={`${f}Hz`} />
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6c757d', marginTop: 4 }}>
            <span>20Hz</span><span>100Hz</span><span>1kHz</span><span>10kHz</span><span>20kHz</span>
          </div>
          <p style={{ marginTop: '0.75rem' }}><strong>Usable Range:</strong> {low}Hz — {high}Hz (±3dB)</p>
          <p><strong>Octaves:</strong> {(Math.log2(high / low)).toFixed(1)}</p>
        </Result>}
      </div>
    }
    case 'thx-reference-level': {
      const vol = N(s('vol'))
      const ref = vol > 0 ? (vol < 1500 ? 82 : vol < 3000 ? 85 : 85) : 0
      return <div>
        <Input label="Room Volume" k="vol" ph="2400" unit="ft³" />
        {vol > 0 && <Result>
          <h4>THX Reference Levels</h4>
          <p><strong>Reference Level (each main speaker):</strong> {ref} dB SPL at listening position</p>
          <p><strong>Subwoofer Reference:</strong> {ref + 10} dB SPL (LFE channel is +10dB)</p>
          <p><strong>Peak Level (with headroom):</strong> {ref + 20} dB SPL</p>
          <p><strong>Your Room:</strong> {vol < 1500 ? 'Small — THX Select certification level (~82dB ref)' : vol < 3000 ? 'Medium — THX Select2/Dominus level' : 'Large — THX Ultra/Dominus level (85dB ref)'}</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>Reference level is how the movie director intended the audio to be experienced.</p>
        </Result>}
      </div>
    }
    case 'dolby-atmos-channel-calculator': {
      const vol = N(s('vol')); const budget = N(s('budget'))
      return <div>
        <Input label="Room Volume" k="vol" ph="2400" unit="ft³" />
        <Input label="Audio Budget" k="budget" ph="3000" unit="$" />
        {vol > 0 && <Result>
          <h4>Recommended Atmos Configuration</h4>
          {budget < 1000 ? <>
            <p><strong>Recommended:</strong> Atmos Soundbar (3.1.2)</p>
            <p>At this budget, an Atmos soundbar is the best path. Consider Polk MagniFi Max AX or Vizio Elevate.</p>
          </> : budget < 2500 ? <>
            <p><strong>Recommended:</strong> 5.1.2 Atmos</p>
            <p>Budget receiver + 5.1 speakers + 2 in-ceiling for height. This is the entry point for true Atmos.</p>
          </> : budget < 5000 ? <>
            <p><strong>Recommended:</strong> {vol < 2000 ? '5.1.4' : '7.1.4'} Atmos</p>
            <p>Mid-range receiver + quality speakers + {vol < 2000 ? '4' : '4'} height channels. The sweet spot for immersion.</p>
          </> : <>
            <p><strong>Recommended:</strong> 7.1.4 or 9.1.6 Atmos</p>
            <p>Premium receiver with Dirac Live + reference speakers + maximum height channels. Cinema-reference quality.</p>
          </>}
        </Result>}
      </div>
    }
    case 'equalizer-preset-generator': {
      const issue = s('issue')
      return <div>
        <Select label="Room Issue" k="issue" options={[
          ['boomy','Boomy/Muddy Bass'],['thin','Thin/No Bass'],['harsh','Harsh/Bright Highs'],['muffled','Muffled/Dull Sound'],['echo','Echoey/Reverberant'],['dialogue','Poor Dialogue Clarity']
        ]} />
        {issue && <Result>
          <h4>EQ Preset: {issue.charAt(0).toUpperCase() + issue.slice(1)} Fix</h4>
          {issue === 'boomy' && <><p>31Hz: -2dB | 63Hz: -4dB | 125Hz: -3dB | 250Hz: -2dB | 500Hz: 0dB</p><p>Also try: bass trap placement, moving sub away from corners</p></>}
          {issue === 'thin' && <><p>31Hz: +3dB | 63Hz: +4dB | 125Hz: +2dB | 250Hz: +1dB | 500Hz: 0dB</p><p>Also try: corner sub placement, sealed sub (tighter bass)</p></>}
          {issue === 'harsh' && <><p>2kHz: -2dB | 4kHz: -3dB | 8kHz: -2dB | 16kHz: -1dB</p><p>Also try: absorption panels at first reflection points, toe speakers in/out</p></>}
          {issue === 'muffled' && <><p>2kHz: +2dB | 4kHz: +3dB | 8kHz: +2dB | 16kHz: +1dB</p><p>Also try: removing heavy curtains near speakers, checking speaker positioning</p></>}
          {issue === 'echo' && <><p>EQ won't fix echo. Add absorption: panels at first reflection points, thick rug, heavy curtains, bookshelves.</p><p>Target RT60: 0.3-0.5 seconds for home theater</p></>}
          {issue === 'dialogue' && <><p>250Hz: -1dB | 500Hz: +1dB | 1kHz: +2dB | 2kHz: +3dB | 4kHz: +2dB</p><p>Also try: center channel at ear level, angle toward listener, Dynamic Range Compression (DRC) for night viewing</p></>}
        </Result>}
      </div>
    }
    case 'sound-isolation-calculator': {
      const wall = s('wall')
      const stcMap: Record<string, [number, string]> = {
        'single-drywall': [33, 'Single layer 1/2" drywall on 2x4 studs'],
        'double-drywall': [40, 'Double layer 5/8" drywall on 2x4 studs'],
        'staggered': [46, 'Double drywall on staggered studs'],
        'resilient': [50, 'Double drywall with resilient channel'],
        'double-wall': [56, 'Separate double stud wall with insulation'],
        'concrete': [48, '8" concrete block, painted'],
      }
      const data = wall ? stcMap[wall] : null
      return <div>
        <Select label="Wall Construction" k="wall" options={Object.entries(stcMap).map(([k, [stc, lbl]]) => [k, `${lbl} (STC ${stc})`])} />
        {data && <Result>
          <h4>Sound Isolation Rating</h4>
          <p><strong>STC Rating:</strong> {data[0]}</p>
          <p><strong>Construction:</strong> {data[1]}</p>
          <p><strong>What you'll hear:</strong> {data[0] < 35 ? 'Normal speech easily heard' : data[0] < 40 ? 'Loud speech heard, normal speech faint' : data[0] < 50 ? 'Loud speech faint, music heard faintly' : data[0] < 55 ? 'Most sounds inaudible' : 'Excellent isolation — most sounds blocked'}</p>
          <p><strong>Home theater recommendation:</strong> STC 50+ (target STC 56+ for dedicated rooms)</p>
        </Result>}
      </div>
    }
    case 'bass-trap-calculator': {
      const l = N(s('l')); const w = N(s('w')); const h = N(s('h'))
      const c = 1130
      return <div>
        <Input label="Room Length" k="l" ph="20" unit="feet" />
        <Input label="Room Width" k="w" ph="15" unit="feet" />
        <Input label="Room Height" k="h" ph="8" unit="feet" />
        {l > 0 && w > 0 && h > 0 && <Result>
          <h4>Bass Trap Recommendations</h4>
          <p><strong>Primary Room Modes:</strong></p>
          <p>Length: {(c/(2*l)).toFixed(1)} Hz, {(c/l).toFixed(1)} Hz, {(3*c/(2*l)).toFixed(1)} Hz</p>
          <p>Width: {(c/(2*w)).toFixed(1)} Hz, {(c/w).toFixed(1)} Hz</p>
          <p>Height: {(c/(2*h)).toFixed(1)} Hz, {(c/h).toFixed(1)} Hz</p>
          <p style={{ marginTop: '0.5rem' }}><strong>Lowest mode:</strong> {(c/(2*Math.max(l,w,h))).toFixed(1)} Hz — bass trap must reach this frequency</p>
          <p><strong>Required trap thickness:</strong> {(c/(4*(c/(2*Math.max(l,w,h))))/12).toFixed(1)} feet (quarter wavelength at lowest mode)</p>
          <p><strong>Placement:</strong> Floor-to-ceiling in all 4 vertical corners (highest priority). Then wall-ceiling corners.</p>
        </Result>}
      </div>
    }
    case 'speaker-sensitivity-calculator': {
      const sens = N(s('sens')); const watts = N(s('watts')); const dist = N(s('dist'), 1)
      const spl = sens > 0 && watts > 0 ? sens + 10 * Math.log10(watts) - 20 * Math.log10(dist) : 0
      return <div>
        <Input label="Speaker Sensitivity" k="sens" ph="88" unit="dB @ 1W/1m" />
        <Input label="Amplifier Power" k="watts" ph="100" unit="watts" />
        <Input label="Listening Distance" k="dist" ph="3" unit="meters" />
        {spl > 0 && <Result>
          <h4>Maximum SPL</h4>
          <p><strong>Max SPL at {s('dist') || '3'}m:</strong> {spl.toFixed(1)} dB</p>
          <p><strong>THX Reference capable:</strong> {spl >= 105 ? '✅ Yes' : '❌ No (need 105dB peak)'}</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>For reference-level playback, each speaker should be capable of 105 dB peaks at the listening position.</p>
        </Result>}
      </div>
    }
    case 'bi-amp-gain-calculator': {
      const totalW = N(s('totalW')); const split = N(s('split'), 70)
      return <div>
        <Input label="Total Amplifier Power" k="totalW" ph="200" unit="watts" />
        <Input label="Low Frequency Power %" k="split" ph="70" unit="%" />
        {totalW > 0 && <Result>
          <h4>Bi-Amp Power Split</h4>
          <p><strong>Low Frequency:</strong> {(totalW * (split || 70) / 100).toFixed(0)}W ({split || 70}%)</p>
          <p><strong>High Frequency:</strong> {(totalW * (1 - (split || 70) / 100)).toFixed(0)}W ({100 - (split || 70)}%)</p>
          <p><strong>dB Gain (LF):</strong> {(10 * Math.log10((split || 70) / 50)).toFixed(1)} dB vs equal split</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>Typical split: 60-80% to LF. Woofers need more power due to longer excursion and lower efficiency.</p>
        </Result>}
      </div>
    }
    case 'subwoofer-crossover-guide': {
      const lowFreq = N(s('lowFreq'))
      return <div>
        <Input label="Main Speaker Low Frequency (-3dB)" k="lowFreq" ph="60" unit="Hz" />
        {lowFreq > 0 && <Result>
          <h4>Subwoofer Crossover Setting</h4>
          <p><strong>Recommended Crossover:</strong> {(lowFreq * 1.2).toFixed(0)} Hz</p>
          <p><strong>THX Default:</strong> 80 Hz (works for most speakers)</p>
          <p><strong>Range to try:</strong> {lowFreq.toFixed(0)} — {(lowFreq * 1.5).toFixed(0)} Hz</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>Set crossover ~20% above your speakers' -3dB point. If speakers go down to 60Hz, try 70-80Hz. Always use the AVR's crossover (set sub to LFE/bypass).</p>
        </Result>}
      </div>
    }
    case 'room-eq-wizard-guide': {
      return <div>
        <Result>
          <h4>Room EQ Wizard (REW) Setup Guide</h4>
          <ol style={{ paddingLeft: '1.25rem', lineHeight: 2, fontSize: '0.9rem' }}>
            <li><strong>Download REW</strong> from roomeqwizard.com (free)</li>
            <li><strong>Get a measurement mic</strong> — UMIK-1 ($79) or miniDSP UMIK-2 ($219)</li>
            <li><strong>Connect mic</strong> to computer via USB. Load mic calibration file in REW.</li>
            <li><strong>Set up SPL meter</strong> — Preferences → SPL Meter → set to C-weighting, Slow</li>
            <li><strong>Calibrate levels</strong> — Use REW's signal generator. Set each speaker to 75dB at listening position.</li>
            <li><strong>Place mic at listening position</strong> at ear height, pointing straight up.</li>
            <li><strong>Measure each speaker individually</strong> — Click "Measure", select sweep, 256k length.</li>
            <li><strong>Analyze results</strong> — Check frequency response, waterfall (decay), RT60.</li>
            <li><strong>Use EQ</strong> — REW can auto-generate PEQ filters for miniDSP or AVR manual EQ.</li>
            <li><strong>Re-measure</strong> after treatment/EQ to verify improvements.</li>
          </ol>
        </Result>
      </div>
    }
    case 'resolution-comparison': {
      const dist = N(s('dist')); const size = N(s('size'))
      const ppi1080 = size > 0 ? Math.sqrt(1920**2 + 1080**2) / size : 0
      const ppi4k = ppi1080 * 2; const ppi8k = ppi1080 * 4
      const arcmin1080 = dist > 0 && ppi1080 > 0 ? 2 * Math.atan(1 / (2 * ppi1080 * dist * 12)) * 180 / Math.PI * 60 : 0
      return <div>
        <Input label="Screen Size" k="size" ph="65" unit="inches diagonal" />
        <Input label="Viewing Distance" k="dist" ph="8" unit="feet" />
        {size > 0 && dist > 0 && <Result>
          <h4>Resolution Comparison at {dist}' from {size}"</h4>
          <p><strong>1080p:</strong> {ppi1080.toFixed(1)} PPI — {arcmin1080 > 1 ? '👁️ Pixels visible' : '✅ Pixels not visible'}</p>
          <p><strong>4K:</strong> {ppi4k.toFixed(1)} PPI — {arcmin1080 / 2 > 1 ? '👁️ May see improvement' : '✅ Beyond human acuity'}</p>
          <p><strong>8K:</strong> {ppi8k.toFixed(1)} PPI — {arcmin1080 / 4 > 1 ? '👁️ May see improvement' : '✅ Well beyond human acuity'}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6c757d' }}>At {dist}' from a {size}" screen, {arcmin1080 > 1 ? '4K offers a visible improvement over 1080p' : 'even 1080p pixels are not individually visible'}.</p>
        </Result>}
      </div>
    }
    case 'hdr-format-checker': {
      const format = s('format')
      return <div>
        <Select label="HDR Format" k="format" options={[
          ['hdr10','HDR10'],['hdr10plus','HDR10+'],['dolbyvision','Dolby Vision'],['hlg','HLG']
        ]} />
        {format && <Result>
          <h4>HDR Format Details</h4>
          {format === 'hdr10' && <><p><strong>HDR10:</strong> Static metadata, 10-bit, open standard</p><p>Supported by: All 4K TVs, all 4K Blu-ray, most streaming</p><p>Max brightness: 1,000-4,000 nits (display dependent)</p></>}
          {format === 'hdr10plus' && <><p><strong>HDR10+:</strong> Dynamic metadata, 10-bit, Samsung-led</p><p>Supported by: Samsung, Panasonic, Amazon Video, some others</p><p>Advantage: Scene-by-scene tone mapping vs static</p></>}
          {format === 'dolbyvision' && <><p><strong>Dolby Vision:</strong> Dynamic metadata, up to 12-bit, licensed</p><p>Supported by: LG, Sony, TCL, Hisense, Netflix, Disney+, Apple TV+</p><p>Advantage: Best dynamic range, most widely supported premium format</p></>}
          {format === 'hlg' && <><p><strong>HLG:</strong> Hybrid Log-Gamma, broadcast standard</p><p>Supported by: All modern 4K TVs, BBC iPlayer, YouTube</p><p>Advantage: Backward compatible with SDR displays</p></>}
        </Result>}
      </div>
    }
    case 'refresh-rate-calculator': {
      const content = s('content')
      return <div>
        <Select label="Primary Content Type" k="content" options={[
          ['movies','Movies (24fps source)'],['tv','TV Shows/Sports (30/60fps)'],['gaming','Gaming'],['mixed','Mixed Use']
        ]} />
        {content && <Result>
          <h4>Refresh Rate Recommendation</h4>
          {content === 'movies' && <><p><strong>Ideal:</strong> 120Hz (evenly divides 24fps with 5:5 pulldown)</p><p>60Hz works fine with 3:2 pulldown. 24Hz native mode is best if available.</p></>}
          {content === 'tv' && <><p><strong>Ideal:</strong> 120Hz for sports (motion interpolation), 60Hz minimum</p><p>For sports, look for TVs with good motion handling and low motion blur.</p></>}
          {content === 'gaming' && <><p><strong>Ideal:</strong> 120Hz minimum, 144Hz for competitive</p><p>Ensure HDMI 2.1 for 4K/120Hz. Look for VRR (Variable Refresh Rate) support — HDMI VRR, FreeSync, or G-Sync.</p></>}
          {content === 'mixed' && <><p><strong>Ideal:</strong> 120Hz — best all-around for every content type</p><p>120Hz handles movies (24×5), sports (60×2), and gaming. It's the sweet spot.</p></>}
        </Result>}
      </div>
    }
    case 'color-space-visualizer': {
      return <div>
        <Result>
          <h4>Color Space Comparison</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { name: 'sRGB', pct: 100, color: '#4CAF50', coverage: '33.3% of visible spectrum' },
              { name: 'DCI-P3', pct: 126, color: '#0077FF', coverage: '45.5% of visible spectrum' },
              { name: 'Rec.2020', pct: 172, color: '#9C27B0', coverage: '75.8% of visible spectrum' },
            ].map(cs => (
              <div key={cs.name} style={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
                <div style={{ width: `${cs.pct * 0.55}%`, height: 80, background: cs.color, borderRadius: 8, margin: '0 auto 0.5rem', minWidth: 60, opacity: 0.7 }} />
                <strong>{cs.name}</strong>
                <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>{cs.coverage}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1rem' }}><strong>For movies:</strong> DCI-P3 is the cinema standard. Most premium TVs cover 95%+ DCI-P3.</p>
          <p><strong>For future-proofing:</strong> Rec.2020 is the target, but no display fully covers it yet.</p>
          <p><strong>Recommendation:</strong> Prioritize DCI-P3 coverage (98%+) over Rec.2020 claims.</p>
        </Result>
      </div>
    }
    case 'input-lag-database': {
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
        <div style={{ marginBottom: '0.75rem' }}>
          <label className="tool-label">Search Device</label>
          <input className="tool-input" placeholder="e.g., LG, Samsung..." value={s('q')} onChange={e => u('q', e.target.value)} />
        </div>
        <Result>
          <h4>Input Lag Database</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ borderBottom: '2px solid #dee2e6' }}><th style={{ textAlign: 'left', padding: '0.5rem' }}>Device</th><th style={{ padding: '0.5rem' }}>Input Lag</th><th style={{ padding: '0.5rem' }}>Gaming</th></tr></thead>
            <tbody>{filtered.map(d => (
              <tr key={d.name} style={{ borderBottom: '1px solid #e9ecef' }}><td style={{ padding: '0.5rem' }}>{d.name}</td><td style={{ padding: '0.5rem', textAlign: 'center' }}>{d.lag}</td><td style={{ padding: '0.5rem', textAlign: 'center' }}>{d.gaming}</td></tr>
            ))}</tbody>
          </table>
        </Result>
      </div>
    }
    case 'contrast-ratio-calculator': {
      const bright = N(s('bright')); const dark = N(s('dark'))
      const ratio = dark > 0 ? bright / dark : 0
      return <div>
        <Input label="Brightest White" k="bright" ph="500" unit="cd/m² (nits)" />
        <Input label="Darkest Black" k="dark" ph="0.05" unit="cd/m² (nits)" />
        {ratio > 0 && <Result>
          <h4>Contrast Ratio</h4>
          <p><strong>Contrast Ratio:</strong> {ratio.toFixed(0)}:1</p>
          <p><strong>ANSI Contrast:</strong> ~{(ratio * 0.5).toFixed(0)}:1 (estimated)</p>
          <p><strong>Rating:</strong> {ratio > 50000 ? '🌟 Exceptional (OLED-level)' : ratio > 5000 ? '✅ Excellent' : ratio > 2000 ? '👍 Good' : '⚠️ Average'}</p>
        </Result>}
      </div>
    }
    case 'projector-lumens-calculator': {
      const screen = N(s('screen')); const ambient = s('ambient')
      const area = screen > 0 ? (screen * 0.872 / 12) * (screen * 0.49 / 12) : 0
      const ftlNeeded = ambient === 'dark' ? 14 : ambient === 'dim' ? 25 : ambient === 'moderate' ? 40 : 50
      const lumens = area * ftlNeeded
      return <div>
        <Input label="Screen Size" k="screen" ph="120" unit="inches diagonal" />
        <Select label="Room Lighting" k="ambient" options={[['dark','Dark Room'],['dim','Dim (some light control)'],['moderate','Moderate Ambient Light'],['bright','Bright Room']]} />
        {screen > 0 && ambient && <Result>
          <h4>Required Projector Lumens</h4>
          <p><strong>Screen Area:</strong> {area.toFixed(1)} sq ft</p>
          <p><strong>Target Brightness:</strong> {ftlNeeded} ft-Lamberts</p>
          <p><strong>Minimum Lumens Needed:</strong> {lumens.toFixed(0)} ANSI lumens</p>
          <p><strong>Recommended (with margin):</strong> {(lumens * 1.3).toFixed(0)} ANSI lumens</p>
        </Result>}
      </div>
    }
    case 'tv-calibration-guide': {
      return <div>
        <Result>
          <h4>TV Calibration Guide — Quick Settings</h4>
          <div style={{ lineHeight: 1.8, fontSize: '0.9rem' }}>
            <p><strong>1. Picture Mode:</strong> Cinema/Movie/Filmmaker Mode (most accurate out of box)</p>
            <p><strong>2. Backlight/OLED Light:</strong> Set to taste (higher = brighter, doesn't affect accuracy)</p>
            <p><strong>3. Contrast:</strong> 95-100% (use test pattern to avoid clipping)</p>
            <p><strong>4. Brightness:</strong> 50% (adjusts black level — use PLUGE test pattern)</p>
            <p><strong>5. Sharpness:</strong> 0-10% (higher adds artificial edge enhancement)</p>
            <p><strong>6. Color:</strong> 50% (default is usually accurate in Movie mode)</p>
            <p><strong>7. Color Temperature:</strong> Warm/Warm2 (closest to D65 standard)</p>
            <p><strong>8. Motion Smoothing:</strong> OFF for movies, low for sports if preferred</p>
            <p><strong>9. HDR:</strong> Ensure all HDMI ports have "Enhanced" or "HDMI Deep Color" enabled</p>
            <p><strong>10. Game Mode:</strong> Enable only when gaming (reduces input lag)</p>
          </div>
        </Result>
      </div>
    }
    case 'gaming-mode-checker': {
      const lag = N(s('lag')); const vrr = s('vrr'); const hdmi = s('hdmi'); const hz = N(s('hz'))
      const score = (lag > 0 ? Math.max(0, 30 - lag) / 30 * 40 : 0) + (vrr === 'yes' ? 20 : 0) + (hdmi === '2.1' ? 20 : hdmi === '2.0' ? 10 : 0) + (hz >= 120 ? 20 : hz >= 60 ? 10 : 0)
      return <div>
        <Input label="Input Lag" k="lag" ph="10" unit="ms (game mode)" />
        <Select label="VRR Support" k="vrr" options={[['yes','Yes (HDMI VRR/FreeSync/G-Sync)'],['no','No']]} />
        <Select label="HDMI Version" k="hdmi" options={[['2.1','HDMI 2.1'],['2.0','HDMI 2.0'],['1.4','HDMI 1.4']]} />
        <Input label="Max Refresh Rate" k="hz" ph="120" unit="Hz" />
        {(lag > 0 || vrr || hdmi) && <Result>
          <h4>Gaming Suitability Score</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: score >= 80 ? '#4CAF50' : score >= 50 ? '#FF9800' : '#f44336' }}>{score.toFixed(0)}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>/100 — {score >= 80 ? 'Excellent for Gaming' : score >= 50 ? 'Good for Casual Gaming' : 'Not Ideal for Gaming'}</div>
          </div>
          {lag > 0 && <p>Input Lag: {lag}ms — {lag <= 10 ? '✅ Excellent' : lag <= 20 ? '👍 Good' : '⚠️ Noticeable'}</p>}
        </Result>}
      </div>
    }
    case 'burn-in-risk-calculator': {
      const hrs = N(s('hrs')); const static_pct = N(s('static')); const brightness = N(s('brightness'), 50)
      const risk = hrs * static_pct / 100 * brightness / 50
      return <div>
        <Input label="Daily TV Usage" k="hrs" ph="6" unit="hours" />
        <Input label="Static Content %" k="static" ph="30" unit="% (news tickers, HUDs, logos)" />
        <Input label="Brightness Level" k="brightness" ph="50" unit="% of max" />
        {hrs > 0 && <Result>
          <h4>OLED Burn-In Risk Assessment</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: risk > 300 ? '#f44336' : risk > 100 ? '#FF9800' : '#4CAF50', marginBottom: '0.5rem' }}>
            {risk > 300 ? '⚠️ High Risk' : risk > 100 ? '⚡ Moderate Risk' : '✅ Low Risk'}
          </div>
          <p><strong>Risk Score:</strong> {risk.toFixed(0)} (lower is better)</p>
          <p><strong>Estimated safe period:</strong> {risk > 300 ? '2-3 years' : risk > 100 ? '4-6 years' : '7+ years'} before noticeable burn-in</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d' }}>Mitigation: use screen savers, pixel shift, vary content, reduce brightness for static content. Modern OLEDs (2024+) have significantly improved burn-in resistance.</p>
        </Result>}
      </div>
    }
    case 'budget-planner': {
      const budget = N(s('budget'))
      return <div>
        <Input label="Total Budget" k="budget" ph="3000" unit="$" />
        {budget > 0 && <Result>
          <h4>Budget Allocation</h4>
          {[
            { name: 'Speakers/Soundbar', pct: 35, color: '#0077FF' },
            { name: 'AV Receiver', pct: 20, color: '#4CAF50' },
            { name: 'Subwoofer', pct: 15, color: '#FF9800' },
            { name: 'Display (TV/Projector)', pct: 0, color: '#9C27B0' },
            { name: 'Cables & Accessories', pct: 5, color: '#795548' },
            { name: 'Room Treatment', pct: 15, color: '#607D8B' },
            { name: 'Misc / Contingency', pct: 10, color: '#E91E63' },
          ].map(item => (
            <div key={item.name} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 2 }}>
                <span>{item.name}</span>
                <strong>${(budget * item.pct / 100).toFixed(0)} ({item.pct}%)</strong>
              </div>
              <div style={{ height: 8, background: '#e9ecef', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#6c757d' }}>Note: Display budget is typically separate. This allocates your audio/theater equipment budget. Adjust percentages based on your priorities.</p>
        </Result>}
      </div>
    }
    case 'price-per-inch': {
      const price = N(s('price')); const size = N(s('size'))
      return <div>
        <Input label="TV Price" k="price" ph="1499" unit="$" />
        <Input label="Screen Size" k="size" ph="65" unit="inches diagonal" />
        {price > 0 && size > 0 && <Result>
          <h4>Value Analysis</h4>
          <p><strong>Price Per Inch:</strong> ${(price / size).toFixed(2)}/inch</p>
          <p><strong>Price Per Square Inch:</strong> ${(price / (size * 0.872 * size * 0.49)).toFixed(4)}/sq inch</p>
          <p><strong>Value Rating:</strong> {price / size < 15 ? '🌟 Excellent value' : price / size < 25 ? '✅ Good value' : price / size < 40 ? '👍 Fair' : '💰 Premium pricing'}</p>
        </Result>}
      </div>
    }
    case 'cost-per-year': {
      const price = N(s('price')); const watts = N(s('watts')); const hrs = N(s('hrs'), 4)
      const rate = N(s('rate'), 0.12); const subs = N(s('subs'), 0); const years = N(s('years'), 5)
      const power = watts * hrs * 365 / 1000 * rate
      const annual = price / years + power + subs * 12
      return <div>
        <Input label="Equipment Price" k="price" ph="2000" unit="$" />
        <Input label="Power Consumption" k="watts" ph="200" unit="watts" />
        <Input label="Daily Usage" k="hrs" ph="4" unit="hours" />
        <Input label="Monthly Subscriptions" k="subs" ph="45" unit="$/month" />
        <Input label="Expected Lifespan" k="years" ph="5" unit="years" />
        {price > 0 && <Result>
          <h4>Annual Total Cost of Ownership</h4>
          <p><strong>Equipment (amortized):</strong> ${(price / (years || 5)).toFixed(2)}/year</p>
          <p><strong>Electricity:</strong> ${power.toFixed(2)}/year</p>
          <p><strong>Subscriptions:</strong> ${(subs * 12).toFixed(2)}/year</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.5rem' }}><strong>Total Annual Cost:</strong> ${annual.toFixed(2)}/year (${(annual / 12).toFixed(2)}/month)</p>
        </Result>}
      </div>
    }
    case 'streaming-service-calculator': {
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
      const total = services.filter(s => selected.includes(s.id)).reduce((a, s) => a + s.price, 0)
      return <div>
        <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '1rem' }}>Select your streaming services:</p>
        {services.map(svc => (
          <label key={svc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', cursor: 'pointer', borderRadius: 8, marginBottom: 4 }}
            onMouseOver={e => (e.currentTarget.style.background = '#f1f3f5')} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
            <input type="checkbox" checked={selected.includes(svc.id)} onChange={() => toggleSel(svc.id)} />
            <div style={{ flex: 1 }}><strong>{svc.name}</strong> <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>— {svc.content}</span></div>
            <strong>${svc.price}/mo</strong>
          </label>
        ))}
        <Result>
          <h4>Your Streaming Costs</h4>
          <p><strong>Monthly:</strong> ${total.toFixed(2)}</p>
          <p><strong>Annual:</strong> ${(total * 12).toFixed(2)}</p>
          <p><strong>Services:</strong> {selected.length} selected</p>
          {total > 50 && <p style={{ color: '#FF9800' }}>💡 Tip: Consider rotating services monthly instead of subscribing to all at once.</p>}
        </Result>
      </div>
    }
    case 'equipment-comparison': {
      return <div>
        <div className="grid-2">
          <div>
            <h4 style={{ marginBottom: '0.75rem' }}>Device A</h4>
            <Input label="Name" k="a_name" ph="LG C4 OLED" />
            <Input label="Price" k="a_price" ph="1799" unit="$" />
            <Input label="Size" k="a_size" ph="65" unit="inches" />
            <Input label="Rating" k="a_rating" ph="9.5" unit="/10" />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.75rem' }}>Device B</h4>
            <Input label="Name" k="b_name" ph="Samsung QN90D" />
            <Input label="Price" k="b_price" ph="1299" unit="$" />
            <Input label="Size" k="b_size" ph="65" unit="inches" />
            <Input label="Rating" k="b_rating" ph="8.9" unit="/10" />
          </div>
        </div>
        {(s('a_name') || s('b_name')) && <Result>
          <h4>Comparison</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ borderBottom: '2px solid #dee2e6' }}><th style={{ textAlign: 'left', padding: '0.5rem' }}></th><th style={{ padding: '0.5rem' }}>{s('a_name') || 'Device A'}</th><th style={{ padding: '0.5rem' }}>{s('b_name') || 'Device B'}</th></tr></thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}><td style={{ padding: '0.5rem' }}>Price</td><td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: N(s('a_price')) <= N(s('b_price')) ? 700 : 400, color: N(s('a_price')) <= N(s('b_price')) ? '#4CAF50' : undefined }}>${s('a_price')}</td><td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: N(s('b_price')) <= N(s('a_price')) ? 700 : 400, color: N(s('b_price')) <= N(s('a_price')) ? '#4CAF50' : undefined }}>${s('b_price')}</td></tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}><td style={{ padding: '0.5rem' }}>Price/Inch</td><td style={{ padding: '0.5rem', textAlign: 'center' }}>${(N(s('a_price'))/N(s('a_size'))).toFixed(2)}</td><td style={{ padding: '0.5rem', textAlign: 'center' }}>${(N(s('b_price'))/N(s('b_size'))).toFixed(2)}</td></tr>
              <tr><td style={{ padding: '0.5rem' }}>Rating</td><td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: N(s('a_rating')) >= N(s('b_rating')) ? 700 : 400, color: N(s('a_rating')) >= N(s('b_rating')) ? '#4CAF50' : undefined }}>{s('a_rating')}/10</td><td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: N(s('b_rating')) >= N(s('a_rating')) ? 700 : 400, color: N(s('b_rating')) >= N(s('a_rating')) ? '#4CAF50' : undefined }}>{s('b_rating')}/10</td></tr>
            </tbody>
          </table>
        </Result>}
      </div>
    }
    case 'upgrade-priority-planner': {
      const tv_age = N(s('tv_age')); const speaker_age = N(s('speaker_age')); const avr_age = N(s('avr_age'))
      const items = [
        { name: 'Speakers', age: speaker_age, priority: speaker_age > 8 ? 'High' : speaker_age > 5 ? 'Medium' : 'Low' },
        { name: 'AV Receiver', age: avr_age, priority: avr_age > 5 ? 'High' : avr_age > 3 ? 'Medium' : 'Low' },
        { name: 'TV/Display', age: tv_age, priority: tv_age > 6 ? 'High' : tv_age > 4 ? 'Medium' : 'Low' },
      ].sort((a, b) => (b.age || 0) - (a.age || 0))
      return <div>
        <Input label="TV/Display Age" k="tv_age" ph="5" unit="years" />
        <Input label="Speaker Age" k="speaker_age" ph="3" unit="years" />
        <Input label="AV Receiver Age" k="avr_age" ph="4" unit="years" />
        {(tv_age > 0 || speaker_age > 0 || avr_age > 0) && <Result>
          <h4>Upgrade Priority</h4>
          {items.map((item, i) => (
            <p key={item.name}><strong>#{i+1} {item.name}</strong> ({item.age || 0} years old) — <span style={{ color: item.priority === 'High' ? '#f44336' : item.priority === 'Medium' ? '#FF9800' : '#4CAF50' }}>{item.priority} Priority</span></p>
          ))}
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6c757d' }}>AVRs age fastest (HDMI standards, room correction). Good speakers last 15+ years. TVs typically 5-8 years.</p>
        </Result>}
      </div>
    }
    case 'used-equipment-estimator': {
      const original = N(s('original')); const age = N(s('age')); const condition = s('condition')
      const condMult = condition === 'mint' ? 0.85 : condition === 'good' ? 0.7 : condition === 'fair' ? 0.5 : 0.3
      const ageMult = Math.max(0.1, 1 - age * 0.15)
      const value = original * condMult * ageMult
      return <div>
        <Input label="Original Price" k="original" ph="1500" unit="$" />
        <Input label="Age" k="age" ph="2" unit="years" />
        <Select label="Condition" k="condition" options={[['mint','Mint/Like New'],['good','Good (light use)'],['fair','Fair (normal wear)'],['poor','Poor (heavy wear)']]} />
        {original > 0 && age >= 0 && condition && <Result>
          <h4>Estimated Value</h4>
          <p><strong>Fair Market Value:</strong> ${value.toFixed(0)}</p>
          <p><strong>Selling Range:</strong> ${(value * 0.85).toFixed(0)} — ${(value * 1.15).toFixed(0)}</p>
          <p><strong>Depreciation:</strong> {((1 - value/original) * 100).toFixed(0)}% from original</p>
        </Result>}
      </div>
    }
    case 'black-friday-tracker': {
      const categories = [
        { name: '65" 4K TVs', normal: '$1,200-2,500', bf: '$799-1,799', savings: '25-40%' },
        { name: '75" 4K TVs', normal: '$1,800-3,500', bf: '$1,199-2,499', savings: '25-35%' },
        { name: 'Soundbars', normal: '$200-1,200', bf: '$149-899', savings: '20-30%' },
        { name: 'AV Receivers', normal: '$400-2,000', bf: '$299-1,599', savings: '15-25%' },
        { name: 'Streaming Devices', normal: '$30-200', bf: '$18-150', savings: '25-50%' },
        { name: 'HDMI Cables', normal: '$10-30', bf: '$5-15', savings: '40-60%' },
      ]
      return <div>
        <Result>
          <h4>Black Friday Price History (Typical Savings)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead><tr style={{ borderBottom: '2px solid #dee2e6' }}><th style={{ textAlign: 'left', padding: '0.5rem' }}>Category</th><th style={{ padding: '0.5rem' }}>Normal</th><th style={{ padding: '0.5rem' }}>Black Friday</th><th style={{ padding: '0.5rem' }}>Savings</th></tr></thead>
            <tbody>{categories.map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '0.5rem' }}>{c.name}</td><td style={{ padding: '0.5rem', textAlign: 'center' }}>{c.normal}</td>
                <td style={{ padding: '0.5rem', textAlign: 'center', color: '#4CAF50', fontWeight: 600 }}>{c.bf}</td><td style={{ padding: '0.5rem', textAlign: 'center' }}>{c.savings}</td>
              </tr>
            ))}</tbody>
          </table>
          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#6c757d' }}>Best deals: TVs (biggest discounts), streaming devices (often 40-50% off). AV receivers see smaller but consistent discounts.</p>
        </Result>
      </div>
    }
    case 'warranty-comparison': {
      const price = N(s('price')); const extCost = N(s('extCost')); const failRate = N(s('failRate'), 5)
      const extValue = price * (failRate * 2 / 100)
      return <div>
        <Input label="Product Price" k="price" ph="1500" unit="$" />
        <Input label="Extended Warranty Cost" k="extCost" ph="200" unit="$" />
        <Input label="Estimated Failure Rate" k="failRate" ph="5" unit="% within warranty period" />
        {price > 0 && extCost > 0 && <Result>
          <h4>Warranty Value Analysis</h4>
          <p><strong>Expected repair value:</strong> ${extValue.toFixed(0)} (based on {failRate || 5}% failure rate × 2 for extended period)</p>
          <p><strong>Extended warranty cost:</strong> ${extCost}</p>
          <p><strong>Value ratio:</strong> {(extValue / extCost).toFixed(2)}x</p>
          <p><strong>Recommendation:</strong> {extValue > extCost ? '✅ Worth buying — expected value exceeds cost' : '❌ Skip — save the money for potential repair or replacement'}</p>
          <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.5rem' }}>General rule: Skip extended warranties on items under $500. Consider for $1000+ electronics if failure rate is above 8%.</p>
        </Result>}
      </div>
    }
    case 'energy-star-calculator': {
      const watts = N(s('watts')); const hrs = N(s('hrs'), 4); const category = s('category')
      const kwhYear = watts * hrs * 365 / 1000
      const benchmarks: Record<string, number> = { 'tv': 200, 'projector': 350, 'receiver': 400, 'soundbar': 100 }
      const benchmark = benchmarks[category] || 250
      const rating = kwhYear > 0 ? Math.min(100, Math.round((1 - (kwhYear - benchmark * 0.5) / (benchmark * 1.5)) * 100)) : 0
      return <div>
        <Select label="Equipment Type" k="category" options={[['tv','TV/Display'],['projector','Projector'],['receiver','AV Receiver'],['soundbar','Soundbar']]} />
        <Input label="Power Consumption" k="watts" ph="150" unit="watts" />
        <Input label="Daily Usage" k="hrs" ph="4" unit="hours" />
        {watts > 0 && <Result>
          <h4>Energy Efficiency Rating</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: rating >= 70 ? '#4CAF50' : rating >= 40 ? '#FF9800' : '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>{rating}</div>
            <div><strong>{rating >= 70 ? 'Efficient' : rating >= 40 ? 'Average' : 'Inefficient'}</strong><br/><span style={{ fontSize: '0.85rem', color: '#6c757d' }}>{kwhYear.toFixed(0)} kWh/year</span></div>
          </div>
          <p><strong>Annual Energy Cost:</strong> ${(kwhYear * 0.12).toFixed(2)} (at $0.12/kWh)</p>
          <p><strong>Category Average:</strong> ~{benchmark} kWh/year</p>
        </Result>}
      </div>
    }
    default:
      return <div className="tool-result"><p>Tool coming soon! Check back for updates.</p></div>
  }
}

export default function ToolDetail() {
  const { slug } = useParams()
  const tool = tools.find(t => t.slug === slug)
  if (!tool) return <div className="container section"><h1>Tool not found</h1><Link to="/tools">← Back to Tools</Link></div>

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: '#fff', padding: '2.5rem 0' }}>
        <div className="container">
          <Link to="/tools" style={{ color: '#adb5bd', display: 'flex', alignItems: 'center', gap: 4, marginBottom: '1rem', fontSize: '0.85rem' }}><ArrowLeft size={14} /> All Tools</Link>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{tool.icon}</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{tool.name}</h1>
          <p style={{ color: '#adb5bd' }}>{tool.description}</p>
          <span style={{ fontSize: '0.75rem', background: 'rgba(0,119,255,0.2)', color: '#0077FF', padding: '0.25rem 0.75rem', borderRadius: 4, fontWeight: 600 }}>{tool.category}</span>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="card">
            <ToolEngine slug={tool.slug} />
          </div>
        </div>
      </section>
    </div>
  )
}
