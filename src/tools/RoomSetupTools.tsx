import { N, useToolState, Input, Select, Result } from './shared'

export function ScreenSizeCalculator() {
  const { s, u } = useToolState()
  const dist = N(s('dist'))
  const thx = dist > 0 ? (dist * 12) / 1.2 : 0
  const smpte = dist > 0 ? (dist * 12) / 1.6 : 0
  return <div>
    <Input label="Viewing Distance" k="dist" ph="10" unit="feet" s={s} u={u} />
    {dist > 0 && <Result>
      <h4>Recommended Screen Sizes</h4>
      <p><strong>THX Recommended (36° viewing angle):</strong> {thx.toFixed(0)}" diagonal</p>
      <p><strong>SMPTE Recommended (30° viewing angle):</strong> {smpte.toFixed(0)}" diagonal</p>
      <p><strong>Good Range:</strong> {(smpte * 0.85).toFixed(0)}" to {(thx * 1.05).toFixed(0)}" diagonal</p>
      <p className="mt-2 text-sm text-gray-400">THX recommends a 36° viewing angle for an immersive cinema experience. SMPTE recommends 30° for a comfortable viewing experience.</p>
    </Result>}
  </div>
}

export function ProjectorThrowDistance() {
  const { s, u } = useToolState()
  const screen = N(s('screen')); const ratio = N(s('ratio'), 1.5)
  const dist = screen > 0 ? (screen * ratio) / 12 : 0
  return <div>
    <Input label="Screen Size (diagonal)" k="screen" ph="120" unit="inches" s={s} u={u} />
    <Input label="Throw Ratio" k="ratio" ph="1.5" s={s} u={u} />
    <p className="text-xs text-gray-400 mb-3">Typical throw ratios: Short throw 0.4-0.8, Standard 1.2-2.0, Long throw 2.0+</p>
    {screen > 0 && <Result>
      <h4>Projector Placement</h4>
      <p><strong>Required Distance:</strong> {dist.toFixed(1)} feet ({(dist * 12).toFixed(0)} inches)</p>
      <p><strong>Screen Width (16:9):</strong> {(screen * 0.872).toFixed(1)}" × {(screen * 0.49).toFixed(1)}"</p>
    </Result>}
  </div>
}

export function SpeakerPlacementGuide() {
  const { s, u } = useToolState()
  const l = N(s('l')); const w = N(s('w')); const config = s('config') || '5.1'
  return <div>
    <Input label="Room Length" k="l" ph="20" unit="feet" s={s} u={u} />
    <Input label="Room Width" k="w" ph="15" unit="feet" s={s} u={u} />
    <Select label="Configuration" k="config" options={[['5.1','5.1 Surround'],['7.1','7.1 Surround'],['5.1.2','5.1.2 Atmos'],['7.1.4','7.1.4 Atmos']]} s={s} u={u} />
    {l > 0 && w > 0 && <Result>
      <h4>Speaker Positions for {config} — {l}' × {w}' Room</h4>
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

export function RoomAcousticsCalculator() {
  const { s, u } = useToolState()
  const l = N(s('l')); const w = N(s('w')); const h = N(s('h'))
  const c = 1130
  const modes = l > 0 && w > 0 && h > 0 ? {
    lengthModes: [1,2,3].map(n => (n * c / (2 * l)).toFixed(1)),
    widthModes: [1,2,3].map(n => (n * c / (2 * w)).toFixed(1)),
    heightModes: [1,2,3].map(n => (n * c / (2 * h)).toFixed(1)),
    volume: l * w * h,
    rt60est: 0.05 * (l * w * h) ** (1/3)
  } : null
  return <div>
    <Input label="Room Length" k="l" ph="20" unit="feet" s={s} u={u} />
    <Input label="Room Width" k="w" ph="15" unit="feet" s={s} u={u} />
    <Input label="Room Height" k="h" ph="8" unit="feet" s={s} u={u} />
    {modes && <Result>
      <h4>Room Acoustic Analysis</h4>
      <p><strong>Room Volume:</strong> {modes.volume.toFixed(0)} ft³</p>
      <p><strong>Estimated RT60:</strong> {modes.rt60est.toFixed(2)}s (untreated)</p>
      <p className="mt-2"><strong>Length Modes:</strong> {modes.lengthModes.join(' Hz, ')} Hz</p>
      <p><strong>Width Modes:</strong> {modes.widthModes.join(' Hz, ')} Hz</p>
      <p><strong>Height Modes:</strong> {modes.heightModes.join(' Hz, ')} Hz</p>
      <p className="mt-2 text-sm text-gray-400">
        {modes.volume < 1500 ? 'Small room — bass management is critical. Consider dual subwoofers and extensive bass trapping.' :
         modes.volume < 3000 ? 'Medium room — good for home theater. Standard acoustic treatment recommended.' :
         'Large room — excellent for theater. May need additional amplification power.'}
      </p>
    </Result>}
  </div>
}

export function SeatingDistanceCalculator() {
  const { s, u } = useToolState()
  const screen = N(s('screen'))
  return <div>
    <Input label="Screen Size (diagonal)" k="screen" ph="65" unit="inches" s={s} u={u} />
    {screen > 0 && <Result>
      <h4>Recommended Viewing Distance</h4>
      <p><strong>THX (immersive):</strong> {(screen / 12 * 1.2).toFixed(1)} feet</p>
      <p><strong>SMPTE (comfortable):</strong> {(screen / 12 * 1.6).toFixed(1)} feet</p>
      <p><strong>4K detail threshold:</strong> {(screen / 12 * 1.0).toFixed(1)} feet</p>
      <p><strong>Recommended range:</strong> {(screen / 12 * 1.2).toFixed(1)} — {(screen / 12 * 1.6).toFixed(1)} feet</p>
    </Result>}
  </div>
}

export function SubwooferPlacement() {
  const { s, u } = useToolState()
  const l = N(s('l')); const w = N(s('w')); const subs = s('subs') || '1'
  return <div>
    <Input label="Room Length" k="l" ph="20" unit="feet" s={s} u={u} />
    <Input label="Room Width" k="w" ph="15" unit="feet" s={s} u={u} />
    <Select label="Number of Subwoofers" k="subs" options={[['1','1 Subwoofer'],['2','2 Subwoofers'],['4','4 Subwoofers']]} s={s} u={u} />
    {l > 0 && w > 0 && <Result>
      <h4>Optimal Subwoofer Positions</h4>
      {subs === '1' && <>
        <p><strong>Position 1 (front wall):</strong> {(w * 0.38).toFixed(1)}' from left wall</p>
        <p><strong>Position 2 (corner):</strong> Front-left corner — maximum output, less even response</p>
        <p><strong>Position 3 (midwall):</strong> {(l * 0.5).toFixed(1)}' along a side wall — smoothest single-sub response</p>
      </>}
      {(subs === '2' || subs === '4') && <>
        <p><strong>Sub 1:</strong> Front wall, {(w * 0.5).toFixed(1)}' from left wall (centered)</p>
        <p><strong>Sub 2:</strong> Back wall, {(w * 0.5).toFixed(1)}' from left wall (centered)</p>
        <p className="text-sm text-gray-400 mt-2">Opposing wall placement cancels length-wise room modes.</p>
      </>}
      {subs === '4' && <>
        <p><strong>Sub 3:</strong> Left wall, {(l * 0.5).toFixed(1)}' from front wall</p>
        <p><strong>Sub 4:</strong> Right wall, {(l * 0.5).toFixed(1)}' from front wall</p>
        <p className="text-sm text-gray-400">4 subs at midpoints provides the most even bass distribution.</p>
      </>}
    </Result>}
  </div>
}

export function AspectRatioCalculator() {
  const { s, u } = useToolState()
  const w = N(s('w')); const h = N(s('h'))
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const rw = Math.round(w), rh = Math.round(h)
  const g = rw > 0 && rh > 0 ? gcd(rw, rh) : 1
  return <div>
    <Input label="Width" k="w" ph="1920" unit="pixels" s={s} u={u} />
    <Input label="Height" k="h" ph="1080" unit="pixels" s={s} u={u} />
    {w > 0 && h > 0 && <Result>
      <h4>Aspect Ratio Results</h4>
      <p><strong>Aspect Ratio:</strong> {rw/g}:{rh/g} ({(w/h).toFixed(2)}:1)</p>
      <p><strong>Total Pixels:</strong> {(w * h / 1000000).toFixed(2)} megapixels</p>
      <p><strong>Diagonal:</strong> {Math.sqrt(w*w + h*h).toFixed(0)} pixels</p>
      <p><strong>Common match:</strong> {w/h > 2.3 ? '21:9 Ultrawide' : w/h > 1.7 ? '16:9 Widescreen' : w/h > 1.5 ? '16:10 Wide' : '4:3 Standard'}</p>
    </Result>}
  </div>
}

export function ScreenGainCalculator() {
  const { s, u } = useToolState()
  const lumens = N(s('lumens')); const screen = N(s('screen')); const ambient = N(s('ambient'))
  const area = screen > 0 ? (screen * 0.872 / 12) * (screen * 0.49 / 12) : 0
  const ftl = lumens > 0 && area > 0 ? lumens / area : 0
  return <div>
    <Input label="Projector Lumens" k="lumens" ph="2500" unit="ANSI lumens" s={s} u={u} />
    <Input label="Screen Size" k="screen" ph="120" unit="inches diagonal" s={s} u={u} />
    <Select label="Ambient Light" k="ambient" options={[['0','Dark room (0 lux)'],['50','Dim room (50 lux)'],['150','Moderate light (150 lux)'],['300','Bright room (300 lux)']]} s={s} u={u} />
    {lumens > 0 && screen > 0 && <Result>
      <h4>Screen Gain Recommendation</h4>
      <p><strong>Screen Area:</strong> {area.toFixed(1)} sq ft</p>
      <p><strong>Foot-Lamberts (gain 1.0):</strong> {ftl.toFixed(1)} fL</p>
      <p><strong>Recommended Gain:</strong> {ambient <= 50 ? '1.0 — 1.3 (matte white)' : ambient <= 150 ? '1.3 — 1.8 (high contrast gray)' : '2.0+ (ALR ambient light rejecting)'}</p>
      <p><strong>Target fL:</strong> {ambient <= 50 ? '12-16 fL (cinema reference)' : '20-30 fL (ambient light viewing)'}</p>
    </Result>}
  </div>
}

export function CableLengthCalculator() {
  const { s, u } = useToolState()
  const x1 = N(s('x1')); const y1 = N(s('y1')); const x2 = N(s('x2')); const y2 = N(s('y2'))
  const straight = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
  return <div>
    <p className="text-sm text-gray-400 mb-4">Enter positions in feet from a corner of the room</p>
    <div className="grid-2">
      <div><Input label="Device 1 — X" k="x1" ph="0" unit="feet" s={s} u={u} /></div>
      <div><Input label="Device 1 — Y" k="y1" ph="0" unit="feet" s={s} u={u} /></div>
      <div><Input label="Device 2 — X" k="x2" ph="10" unit="feet" s={s} u={u} /></div>
      <div><Input label="Device 2 — Y" k="y2" ph="8" unit="feet" s={s} u={u} /></div>
    </div>
    {(x1 || y1 || x2 || y2) ? <Result>
      <h4>Cable Length Needed</h4>
      <p><strong>Straight line:</strong> {straight.toFixed(1)} feet</p>
      <p><strong>Along walls (add slack):</strong> {(Math.abs(x2-x1) + Math.abs(y2-y1) + 3).toFixed(1)} feet</p>
      <p><strong>Recommended purchase:</strong> {(Math.ceil((Math.abs(x2-x1) + Math.abs(y2-y1) + 3) / 3) * 3)} foot cable</p>
    </Result> : null}
  </div>
}

export function HdmiBandwidthCalculator() {
  const { s, u } = useToolState()
  const res = s('res'); const fps = N(s('fps'), 60); const hdr = s('hdr')
  const bwMap: Record<string, number> = { '1080p': 1920*1080, '4k': 3840*2160, '8k': 7680*4320 }
  const pixels = bwMap[res] || 0
  const bpp = hdr === 'yes' ? 36 : 24
  const bw = pixels * fps * bpp / 1e9
  return <div>
    <Select label="Resolution" k="res" options={[['1080p','1080p'],['4k','4K'],['8k','8K']]} s={s} u={u} />
    <Input label="Frame Rate" k="fps" ph="60" unit="fps" s={s} u={u} />
    <Select label="HDR" k="hdr" options={[['no','No (8-bit)'],['yes','Yes (10/12-bit)']]} s={s} u={u} />
    {res && <Result>
      <h4>HDMI Requirements</h4>
      <p><strong>Bandwidth Needed:</strong> {bw.toFixed(1)} Gbps</p>
      <p><strong>Required HDMI Version:</strong> {bw <= 10.2 ? 'HDMI 1.4' : bw <= 18 ? 'HDMI 2.0' : bw <= 48 ? 'HDMI 2.1' : 'HDMI 2.1 with DSC'}</p>
      <p><strong>Cable Type:</strong> {bw <= 18 ? 'Standard High Speed HDMI' : 'Ultra High Speed HDMI (48Gbps certified)'}</p>
    </Result>}
  </div>
}

export function PowerConsumptionCalculator() {
  const { s, u } = useToolState()
  const tv = N(s('tv')); const avr = N(s('avr')); const sub = N(s('sub'))
  const other = N(s('other')); const hrs = N(s('hrs'), 4); const rate = N(s('rate'), 0.12)
  const total = tv + avr + sub + other
  const annual = total * hrs * 365 / 1000 * rate
  return <div>
    <Input label="TV/Projector" k="tv" ph="150" unit="watts" s={s} u={u} />
    <Input label="AV Receiver" k="avr" ph="200" unit="watts" s={s} u={u} />
    <Input label="Subwoofer(s)" k="sub" ph="100" unit="watts" s={s} u={u} />
    <Input label="Other Devices" k="other" ph="50" unit="watts" s={s} u={u} />
    <Input label="Daily Usage" k="hrs" ph="4" unit="hours" s={s} u={u} />
    <Input label="Electricity Rate" k="rate" ph="0.12" unit="$/kWh" s={s} u={u} />
    {total > 0 && <Result>
      <h4>Power Consumption</h4>
      <p><strong>Total Watts:</strong> {total}W</p>
      <p><strong>Daily kWh:</strong> {(total * (hrs || 4) / 1000).toFixed(2)} kWh</p>
      <p><strong>Annual Cost:</strong> ${annual.toFixed(2)}/year</p>
      <p><strong>Monthly Cost:</strong> ${(annual/12).toFixed(2)}/month</p>
    </Result>}
  </div>
}

export function BtuCalculator() {
  const { s, u } = useToolState()
  const l = N(s('l')); const w = N(s('w')); const h = N(s('h')); const equip = N(s('equip'))
  const vol = l * w * h; const btu = vol > 0 ? vol * 4 + equip * 3.41 : 0
  return <div>
    <Input label="Room Length" k="l" ph="20" unit="feet" s={s} u={u} />
    <Input label="Room Width" k="w" ph="15" unit="feet" s={s} u={u} />
    <Input label="Room Height" k="h" ph="8" unit="feet" s={s} u={u} />
    <Input label="Total Equipment Watts" k="equip" ph="500" unit="watts" s={s} u={u} />
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

// FIXED: Wire gauge now factors in impedance for recommendation
export function WireGaugeCalculator() {
  const { s, u } = useToolState()
  const watts = N(s('watts')); const impedance = N(s('impedance'), 8); const dist = N(s('dist'))
  const amps = watts > 0 && impedance > 0 ? Math.sqrt(watts / impedance) : 0
  // Wire resistance per 1000ft (round-trip = 2x dist): 16AWG=4.02, 14AWG=2.53, 12AWG=1.59, 10AWG=1.00
  // Target: wire resistance < 5% of speaker impedance
  const maxResistance = impedance * 0.05
  const roundTrip = dist * 2
  const res16 = roundTrip * 4.02 / 1000
  const res14 = roundTrip * 2.53 / 1000
  const res12 = roundTrip * 1.59 / 1000
  const res10 = roundTrip * 1.00 / 1000
  const recommended = res16 <= maxResistance ? '16 AWG' : res14 <= maxResistance ? '14 AWG' : res12 <= maxResistance ? '12 AWG' : '10 AWG'
  const actualRes = res16 <= maxResistance ? res16 : res14 <= maxResistance ? res14 : res12 <= maxResistance ? res12 : res10
  const powerLoss = impedance > 0 ? (actualRes / (impedance + actualRes)) * 100 : 0

  return <div>
    <Input label="Amplifier Power" k="watts" ph="100" unit="watts/channel" s={s} u={u} />
    <Input label="Speaker Impedance" k="impedance" ph="8" unit="ohms" s={s} u={u} />
    <Input label="Cable Run Distance" k="dist" ph="25" unit="feet (one way)" s={s} u={u} />
    {watts > 0 && dist > 0 && <Result>
      <h4>Wire Gauge Recommendation</h4>
      <p><strong>Peak Current:</strong> {amps.toFixed(2)} amps</p>
      <p><strong>Max Wire Resistance (5% rule):</strong> {maxResistance.toFixed(3)}Ω for {impedance}Ω speakers</p>
      <p><strong>Recommended Gauge:</strong> {recommended}</p>
      <p><strong>Wire Resistance ({recommended}):</strong> {actualRes.toFixed(3)}Ω (round-trip {roundTrip}ft)</p>
      <p><strong>Power Loss:</strong> {powerLoss.toFixed(1)}%</p>
      <p className="text-sm text-gray-400 mt-2">
        {impedance <= 4 ? '⚠️ Low impedance speakers need thicker wire — 12 AWG or better recommended.' :
         'Rule of thumb: wire resistance should be less than 5% of speaker impedance to avoid audible loss.'}
      </p>
    </Result>}
  </div>
}

export function MountingHeightCalculator() {
  const { s, u } = useToolState()
  const screen = N(s('screen')); const seatingH = N(s('seatingH'), 42)
  const screenH = screen > 0 ? screen * 0.49 : 0
  const center = seatingH + (screenH / 2)
  const bottomEdge = seatingH - 2
  return <div>
    <Input label="Screen Size" k="screen" ph="65" unit="inches diagonal" s={s} u={u} />
    <Input label="Seated Eye Height" k="seatingH" ph="42" unit="inches from floor" s={s} u={u} />
    {screen > 0 && <Result>
      <h4>Mounting Height</h4>
      <p><strong>Screen Height:</strong> {screenH.toFixed(1)}" tall</p>
      <p><strong>Center of screen at:</strong> {center.toFixed(0)}" from floor</p>
      <p><strong>Bottom edge at:</strong> {bottomEdge.toFixed(0)}" from floor</p>
      <p><strong>Mount center point:</strong> {center.toFixed(0)}" from floor</p>
      <p className="text-sm text-gray-400">The center of the screen should be at seated eye level (±5°) for comfortable viewing.</p>
    </Result>}
  </div>
}

export function RoomVolumeCalculator() {
  const { s, u } = useToolState()
  const l = N(s('l')); const w = N(s('w')); const h = N(s('h'))
  const vol = l * w * h
  return <div>
    <Input label="Length" k="l" ph="20" unit="feet" s={s} u={u} />
    <Input label="Width" k="w" ph="15" unit="feet" s={s} u={u} />
    <Input label="Height" k="h" ph="8" unit="feet" s={s} u={u} />
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
