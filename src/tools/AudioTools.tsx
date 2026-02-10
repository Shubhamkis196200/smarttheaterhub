import { N, useToolState, Input, Select, Result } from './shared'

export function SpeakerImpedanceCalculator() {
  const { s, u } = useToolState()
  const z1 = N(s('z1')); const z2 = N(s('z2')); const mode = s('mode') || 'series'
  const series = z1 + z2; const parallel = z1 > 0 && z2 > 0 ? (z1 * z2) / (z1 + z2) : 0
  return <div>
    <Input label="Speaker 1 Impedance" k="z1" ph="8" unit="ohms" s={s} u={u} />
    <Input label="Speaker 2 Impedance" k="z2" ph="8" unit="ohms" s={s} u={u} />
    <Select label="Wiring" k="mode" options={[['series','Series'],['parallel','Parallel']]} s={s} u={u} />
    {z1 > 0 && z2 > 0 && <Result>
      <h4>Total Impedance</h4>
      <p><strong>Series:</strong> {series.toFixed(1)}Ω (safe for all amplifiers)</p>
      <p><strong>Parallel:</strong> {parallel.toFixed(1)}Ω {parallel < 4 ? '⚠️ May damage some amplifiers' : '✅ Safe'}</p>
      <p><strong>Your Selection ({mode}):</strong> {mode === 'parallel' ? parallel.toFixed(1) : series.toFixed(1)}Ω</p>
    </Result>}
  </div>
}

export function AmplifierPowerCalculator() {
  const { s, u } = useToolState()
  const sens = N(s('sens'), 88); const level = N(s('level'), 85); const dist = N(s('dist'), 10)
  const dbNeeded = level - sens + 20 * Math.log10(dist / 3.28)
  const watts = Math.pow(10, dbNeeded / 10)
  return <div>
    <Input label="Speaker Sensitivity" k="sens" ph="88" unit="dB/1W/1m" s={s} u={u} />
    <Input label="Desired Listening Level" k="level" ph="85" unit="dB" s={s} u={u} />
    <Input label="Listening Distance" k="dist" ph="10" unit="feet" s={s} u={u} />
    {sens > 0 && <Result>
      <h4>Amplifier Power Needed</h4>
      <p><strong>dB above 1W needed:</strong> {dbNeeded.toFixed(1)} dB</p>
      <p><strong>Minimum Power:</strong> {watts.toFixed(1)} watts/channel</p>
      <p><strong>Recommended (with headroom):</strong> {(watts * 3).toFixed(0)} watts/channel</p>
      <p className="text-sm text-gray-400">3× headroom prevents clipping during dynamic peaks in movies.</p>
    </Result>}
  </div>
}

export function CrossoverFrequencyCalculator() {
  const { s, u } = useToolState()
  const low = N(s('low')); const driver = N(s('driver'))
  const xover = driver > 0 ? 1130 * 12 / (Math.PI * driver) : 0
  return <div>
    <Input label="Woofer Low-Freq Limit (-3dB)" k="low" ph="60" unit="Hz" s={s} u={u} />
    <Input label="Woofer Driver Diameter" k="driver" ph="6.5" unit="inches" s={s} u={u} />
    {driver > 0 && <Result>
      <h4>Crossover Point</h4>
      <p><strong>Calculated Crossover:</strong> {xover.toFixed(0)} Hz</p>
      <p><strong>Recommended Range:</strong> {(xover * 0.8).toFixed(0)} — {(xover * 1.2).toFixed(0)} Hz</p>
      <p><strong>Subwoofer Crossover:</strong> {low > 0 ? `${(low * 1.2).toFixed(0)} Hz` : 'Enter woofer low limit'}</p>
    </Result>}
  </div>
}

export function DecibelCalculator() {
  const { s, u } = useToolState()
  const db1 = N(s('db1')); const db2 = N(s('db2'))
  const sum = 10 * Math.log10(Math.pow(10, db1/10) + Math.pow(10, db2/10))
  const dist1 = N(s('dist1')); const dist2 = N(s('dist2')); const splRef = N(s('splRef'))
  const splAtDist = splRef > 0 && dist1 > 0 && dist2 > 0 ? splRef - 20 * Math.log10(dist2 / dist1) : 0
  return <div>
    <h4 className="mb-4">dB Addition</h4>
    <div className="grid-2">
      <Input label="Source 1" k="db1" ph="85" unit="dB" s={s} u={u} />
      <Input label="Source 2" k="db2" ph="85" unit="dB" s={s} u={u} />
    </div>
    {(db1 > 0 || db2 > 0) && <Result>
      <p><strong>Combined Level:</strong> {sum.toFixed(1)} dB</p>
      <p className="text-sm text-gray-400">Two identical sources add +3 dB</p>
    </Result>}
    <h4 className="mt-6 mb-4">Distance SPL</h4>
    <Input label="SPL at Reference Distance" k="splRef" ph="90" unit="dB" s={s} u={u} />
    <div className="grid-2">
      <Input label="Reference Distance" k="dist1" ph="1" unit="meters" s={s} u={u} />
      <Input label="Target Distance" k="dist2" ph="3" unit="meters" s={s} u={u} />
    </div>
    {splAtDist > 0 && <Result>
      <p><strong>SPL at {s('dist2')}m:</strong> {splAtDist.toFixed(1)} dB</p>
      <p className="text-sm text-gray-400">SPL drops 6 dB per doubling of distance</p>
    </Result>}
  </div>
}

export function AudioDelayCalculator() {
  const { s, u } = useToolState()
  const dist = N(s('dist'))
  const delayMs = dist > 0 ? (dist / 1130) * 1000 : 0
  return <div>
    <Input label="Distance" k="dist" ph="10" unit="feet" s={s} u={u} />
    {dist > 0 && <Result>
      <h4>Audio Delay</h4>
      <p><strong>Time Delay:</strong> {delayMs.toFixed(2)} ms</p>
      <p><strong>Samples (44.1kHz):</strong> {(delayMs / 1000 * 44100).toFixed(0)}</p>
      <p><strong>Samples (48kHz):</strong> {(delayMs / 1000 * 48000).toFixed(0)}</p>
      <p className="text-sm text-gray-400">Use this to set speaker delays in your AVR for distance compensation.</p>
    </Result>}
  </div>
}

export function FrequencyResponseVisualizer() {
  const { s, u } = useToolState()
  const low = N(s('low'), 40); const high = N(s('high'), 20000)
  return <div>
    <Input label="Low Frequency (-3dB)" k="low" ph="40" unit="Hz" s={s} u={u} />
    <Input label="High Frequency (-3dB)" k="high" ph="20000" unit="Hz" s={s} u={u} />
    {low > 0 && <Result>
      <h4>Frequency Response Profile</h4>
      <div className="flex items-end gap-0.5" style={{ height: 100 }}>
        {[20,40,60,80,100,200,500,1000,2000,5000,10000,15000,20000].map(f => {
          const h = f >= low && f <= high ? 80 + (Math.sin(f * 0.01) * 3 + Math.cos(f * 0.003) * 2) : Math.max(20, 80 - Math.abs(f < low ? (low - f) / low : (f - high) / high) * 60)
          return <div key={f} className="flex-1 rounded-t" style={{ background: f >= low && f <= high ? '#0077FF' : '#dee2e6', height: `${h}%`, minWidth: 8 }} title={`${f}Hz`} />
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>20Hz</span><span>100Hz</span><span>1kHz</span><span>10kHz</span><span>20kHz</span>
      </div>
      <p className="mt-3"><strong>Usable Range:</strong> {low}Hz — {high}Hz (±3dB)</p>
      <p><strong>Octaves:</strong> {(Math.log2(high / low)).toFixed(1)}</p>
    </Result>}
  </div>
}

export function ThxReferenceLevel() {
  const { s, u } = useToolState()
  const vol = N(s('vol'))
  const ref = vol > 0 ? (vol < 1500 ? 82 : 85) : 0
  return <div>
    <Input label="Room Volume" k="vol" ph="2400" unit="ft³" s={s} u={u} />
    {vol > 0 && <Result>
      <h4>THX Reference Levels</h4>
      <p><strong>Reference Level:</strong> {ref} dB SPL at listening position</p>
      <p><strong>Subwoofer Reference:</strong> {ref + 10} dB SPL (LFE +10dB)</p>
      <p><strong>Peak Level:</strong> {ref + 20} dB SPL</p>
      <p><strong>Your Room:</strong> {vol < 1500 ? 'Small — THX Select (~82dB)' : vol < 3000 ? 'Medium — THX Select2/Dominus' : 'Large — THX Ultra/Dominus (85dB)'}</p>
    </Result>}
  </div>
}

export function DolbyAtmosChannelCalculator() {
  const { s, u } = useToolState()
  const vol = N(s('vol')); const budget = N(s('budget'))
  return <div>
    <Input label="Room Volume" k="vol" ph="2400" unit="ft³" s={s} u={u} />
    <Input label="Audio Budget" k="budget" ph="3000" unit="$" s={s} u={u} />
    {vol > 0 && <Result>
      <h4>Recommended Atmos Configuration</h4>
      {budget < 1000 ? <p><strong>Recommended:</strong> Atmos Soundbar (3.1.2)</p> :
       budget < 2500 ? <p><strong>Recommended:</strong> 5.1.2 Atmos — entry point for true Atmos</p> :
       budget < 5000 ? <p><strong>Recommended:</strong> {vol < 2000 ? '5.1.4' : '7.1.4'} Atmos — sweet spot for immersion</p> :
       <p><strong>Recommended:</strong> 7.1.4 or 9.1.6 Atmos — cinema-reference quality</p>}
    </Result>}
  </div>
}

export function EqualizerPresetGenerator() {
  const { s, u } = useToolState()
  const issue = s('issue')
  const presets: Record<string, [string, string]> = {
    'boomy': ['31Hz: -2dB | 63Hz: -4dB | 125Hz: -3dB | 250Hz: -2dB | 500Hz: 0dB', 'Also try: bass trap placement, moving sub away from corners'],
    'thin': ['31Hz: +3dB | 63Hz: +4dB | 125Hz: +2dB | 250Hz: +1dB | 500Hz: 0dB', 'Also try: corner sub placement, sealed sub (tighter bass)'],
    'harsh': ['2kHz: -2dB | 4kHz: -3dB | 8kHz: -2dB | 16kHz: -1dB', 'Also try: absorption panels at first reflection points'],
    'muffled': ['2kHz: +2dB | 4kHz: +3dB | 8kHz: +2dB | 16kHz: +1dB', 'Also try: removing heavy curtains near speakers'],
    'echo': ['EQ won\'t fix echo. Add absorption: panels at first reflection points, thick rug, heavy curtains.', 'Target RT60: 0.3-0.5 seconds for home theater'],
    'dialogue': ['250Hz: -1dB | 500Hz: +1dB | 1kHz: +2dB | 2kHz: +3dB | 4kHz: +2dB', 'Also try: center channel at ear level, DRC for night viewing'],
  }
  return <div>
    <Select label="Room Issue" k="issue" options={[['boomy','Boomy/Muddy Bass'],['thin','Thin/No Bass'],['harsh','Harsh/Bright Highs'],['muffled','Muffled/Dull Sound'],['echo','Echoey/Reverberant'],['dialogue','Poor Dialogue Clarity']]} s={s} u={u} />
    {issue && presets[issue] && <Result>
      <h4>EQ Preset: {issue.charAt(0).toUpperCase() + issue.slice(1)} Fix</h4>
      <p>{presets[issue][0]}</p>
      <p>{presets[issue][1]}</p>
    </Result>}
  </div>
}

export function SoundIsolationCalculator() {
  const { s, u } = useToolState()
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
    <Select label="Wall Construction" k="wall" options={Object.entries(stcMap).map(([k, [stc, lbl]]) => [k, `${lbl} (STC ${stc})`])} s={s} u={u} />
    {data && <Result>
      <h4>Sound Isolation Rating</h4>
      <p><strong>STC Rating:</strong> {data[0]}</p>
      <p><strong>What you'll hear:</strong> {data[0] < 35 ? 'Normal speech easily heard' : data[0] < 40 ? 'Loud speech heard' : data[0] < 50 ? 'Loud speech faint' : 'Most sounds blocked'}</p>
      <p><strong>Recommendation:</strong> STC 50+ for home theater (56+ for dedicated rooms)</p>
    </Result>}
  </div>
}

export function BassTrapCalculator() {
  const { s, u } = useToolState()
  const l = N(s('l')); const w = N(s('w')); const h = N(s('h'))
  const c = 1130
  return <div>
    <Input label="Room Length" k="l" ph="20" unit="feet" s={s} u={u} />
    <Input label="Room Width" k="w" ph="15" unit="feet" s={s} u={u} />
    <Input label="Room Height" k="h" ph="8" unit="feet" s={s} u={u} />
    {l > 0 && w > 0 && h > 0 && <Result>
      <h4>Bass Trap Recommendations</h4>
      <p><strong>Primary Room Modes:</strong></p>
      <p>Length: {(c/(2*l)).toFixed(1)} Hz, {(c/l).toFixed(1)} Hz, {(3*c/(2*l)).toFixed(1)} Hz</p>
      <p>Width: {(c/(2*w)).toFixed(1)} Hz, {(c/w).toFixed(1)} Hz</p>
      <p>Height: {(c/(2*h)).toFixed(1)} Hz, {(c/h).toFixed(1)} Hz</p>
      <p className="mt-2"><strong>Lowest mode:</strong> {(c/(2*Math.max(l,w,h))).toFixed(1)} Hz</p>
      <p><strong>Required trap thickness:</strong> {(c/(4*(c/(2*Math.max(l,w,h))))/12).toFixed(1)} feet</p>
      <p><strong>Placement:</strong> Floor-to-ceiling in all 4 vertical corners. Then wall-ceiling corners.</p>
    </Result>}
  </div>
}

export function SpeakerSensitivityCalculator() {
  const { s, u } = useToolState()
  const sens = N(s('sens')); const watts = N(s('watts')); const dist = N(s('dist'), 1)
  const spl = sens > 0 && watts > 0 ? sens + 10 * Math.log10(watts) - 20 * Math.log10(dist) : 0
  return <div>
    <Input label="Speaker Sensitivity" k="sens" ph="88" unit="dB @ 1W/1m" s={s} u={u} />
    <Input label="Amplifier Power" k="watts" ph="100" unit="watts" s={s} u={u} />
    <Input label="Listening Distance" k="dist" ph="3" unit="meters" s={s} u={u} />
    {spl > 0 && <Result>
      <h4>Maximum SPL</h4>
      <p><strong>Max SPL at {s('dist') || '3'}m:</strong> {spl.toFixed(1)} dB</p>
      <p><strong>THX Reference capable:</strong> {spl >= 105 ? '✅ Yes' : '❌ No (need 105dB peak)'}</p>
    </Result>}
  </div>
}

export function BiAmpGainCalculator() {
  const { s, u } = useToolState()
  const totalW = N(s('totalW')); const split = N(s('split'), 70)
  return <div>
    <Input label="Total Amplifier Power" k="totalW" ph="200" unit="watts" s={s} u={u} />
    <Input label="Low Frequency Power %" k="split" ph="70" unit="%" s={s} u={u} />
    {totalW > 0 && <Result>
      <h4>Bi-Amp Power Split</h4>
      <p><strong>Low Frequency:</strong> {(totalW * split / 100).toFixed(0)}W ({split}%)</p>
      <p><strong>High Frequency:</strong> {(totalW * (1 - split / 100)).toFixed(0)}W ({100 - split}%)</p>
      <p><strong>dB Gain (LF):</strong> {(10 * Math.log10(split / 50)).toFixed(1)} dB vs equal split</p>
    </Result>}
  </div>
}

export function SubwooferCrossoverGuide() {
  const { s, u } = useToolState()
  const lowFreq = N(s('lowFreq'))
  return <div>
    <Input label="Main Speaker Low Frequency (-3dB)" k="lowFreq" ph="60" unit="Hz" s={s} u={u} />
    {lowFreq > 0 && <Result>
      <h4>Subwoofer Crossover Setting</h4>
      <p><strong>Recommended:</strong> {(lowFreq * 1.2).toFixed(0)} Hz</p>
      <p><strong>THX Default:</strong> 80 Hz</p>
      <p><strong>Range to try:</strong> {lowFreq.toFixed(0)} — {(lowFreq * 1.5).toFixed(0)} Hz</p>
      <p className="text-sm text-gray-400">Set crossover ~20% above your speakers' -3dB point. Use the AVR's crossover (set sub to LFE/bypass).</p>
    </Result>}
  </div>
}

export function RoomEqWizardGuide() {
  return <div>
    <Result>
      <h4>Room EQ Wizard (REW) Setup Guide</h4>
      <ol className="pl-5 leading-8 text-sm">
        <li><strong>Download REW</strong> from roomeqwizard.com (free)</li>
        <li><strong>Get a measurement mic</strong> — UMIK-1 ($79) or miniDSP UMIK-2 ($219)</li>
        <li><strong>Connect mic</strong> via USB. Load calibration file in REW.</li>
        <li><strong>Set up SPL meter</strong> — C-weighting, Slow</li>
        <li><strong>Calibrate levels</strong> — Set each speaker to 75dB at listening position.</li>
        <li><strong>Place mic at listening position</strong> at ear height, pointing up.</li>
        <li><strong>Measure each speaker individually</strong> — Sweep, 256k length.</li>
        <li><strong>Analyze</strong> — Frequency response, waterfall, RT60.</li>
        <li><strong>Generate EQ</strong> — Auto PEQ filters for miniDSP or AVR.</li>
        <li><strong>Re-measure</strong> after treatment/EQ.</li>
      </ol>
    </Result>
  </div>
}
