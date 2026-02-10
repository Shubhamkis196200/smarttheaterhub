import { N, useToolState, Input, Select, Result } from './shared'

export function SmartHomeScenePlanner() {
  const { s, u } = useToolState()
  const scene = s('scene')
  const scenes: Record<string, { devices: string[]; actions: string[]; tip: string }> = {
    'movie': {
      devices: ['Smart Lights (Hue/LIFX)', 'Smart Blinds/Shades', 'AV Receiver', 'TV/Projector', 'Smart Plug (popcorn machine!)'],
      actions: ['Dim lights to 5%', 'Close blinds', 'Set TV to Cinema mode', 'Set AVR input and volume', 'Optional: set thermostat to 72°F'],
      tip: 'Use a single "Movie Time" button/voice command to trigger all at once via HomeKit, Alexa, or Google Home scenes.'
    },
    'gaming': {
      devices: ['Smart Lights (bias lighting)', 'TV/Monitor', 'Gaming Console', 'Smart Power Strip'],
      actions: ['Set bias lighting to 6500K at 10%', 'TV to Game Mode', 'Enable VRR', 'Turn on gaming peripherals'],
      tip: 'Bias lighting at 6500K reduces eye strain and improves perceived contrast.'
    },
    'music': {
      devices: ['Smart Speakers/Whole-Home Audio', 'Smart Lights', 'AV Receiver'],
      actions: ['Set lights to warm 2700K at 50%', 'AVR to stereo/music mode', 'Distribute audio to additional rooms if desired'],
      tip: 'Use Sonos, HEOS, or AirPlay 2 for multi-room synchronized audio.'
    },
    'goodnight': {
      devices: ['All AV Equipment', 'Smart Lights', 'Smart Thermostat', 'Smart Locks'],
      actions: ['Power off all AV equipment', 'Turn off all lights', 'Set thermostat to sleep schedule', 'Lock doors', 'Arm security system'],
      tip: 'A "Goodnight" routine ensures nothing is left running and wasting power.'
    },
  }
  return <div>
    <Select label="Scene Type" k="scene" options={[['movie','🎬 Movie Night'],['gaming','🎮 Gaming Session'],['music','🎵 Music Listening'],['goodnight','🌙 Goodnight']]} s={s} u={u} />
    {scene && scenes[scene] && <Result>
      <h4>Scene: {scene.charAt(0).toUpperCase() + scene.slice(1)}</h4>
      <p className="font-semibold mt-2">Devices Needed:</p>
      <ul className="pl-5 list-disc text-sm">
        {scenes[scene].devices.map(d => <li key={d}>{d}</li>)}
      </ul>
      <p className="font-semibold mt-3">Automation Actions:</p>
      <ol className="pl-5 list-decimal text-sm">
        {scenes[scene].actions.map(a => <li key={a}>{a}</li>)}
      </ol>
      <p className="mt-3 text-sm text-gray-400">💡 {scenes[scene].tip}</p>
    </Result>}
  </div>
}

export function VoiceAssistantComparison() {
  const { s, u } = useToolState()
  const priority = s('priority')
  const recs: Record<string, { winner: string; why: string; runner: string; details: string }> = {
    'av-control': { winner: 'Amazon Alexa', why: 'Best AV device ecosystem — works with Sonos, Denon, Sony, LG, Samsung', runner: 'Google Home (good TV casting)', details: 'Alexa has the most AV-specific skills and device partnerships. "Alexa, turn on the TV and dim the lights" just works with most setups.' },
    'apple': { winner: 'Apple HomeKit / Siri', why: 'Seamless with Apple TV, HomePod, AirPlay 2', runner: 'Alexa (broader device support)', details: 'If you\'re all-in on Apple, HomeKit scenes are the most reliable and private. Limited third-party AV support though.' },
    'diy': { winner: 'Home Assistant', why: 'Most powerful, fully local, works with everything', runner: 'Alexa (for voice control layer)', details: 'Home Assistant can control any device but requires technical setup. Pair with Alexa or Google for voice control.' },
    'privacy': { winner: 'Home Assistant (local)', why: 'No cloud dependency, all data stays local', runner: 'Apple HomeKit (encrypted, minimal cloud)', details: 'If privacy matters, Home Assistant with local voice (Whisper + Piper) keeps everything on your network.' },
  }
  return <div>
    <Select label="Your Priority" k="priority" options={[['av-control','Best AV Control'],['apple','Apple Ecosystem'],['diy','DIY / Maximum Control'],['privacy','Privacy First']]} s={s} u={u} />
    {priority && recs[priority] && <Result>
      <h4>Recommended: {recs[priority].winner}</h4>
      <p><strong>Why:</strong> {recs[priority].why}</p>
      <p><strong>Runner-up:</strong> {recs[priority].runner}</p>
      <p className="mt-2">{recs[priority].details}</p>
    </Result>}
  </div>
}

export function BiasLightingCalculator() {
  const { s, u } = useToolState()
  const size = N(s('size')); const type = s('type')
  const perimeterInches = size > 0 ? 2 * (size * 0.872 + size * 0.49) : 0
  const ledLength = perimeterInches / 12
  const lumens = type === 'oled' ? 40 : type === 'lcd' ? 60 : 80
  return <div>
    <Input label="Screen Size" k="size" ph="65" unit="inches diagonal" s={s} u={u} />
    <Select label="Display Type" k="type" options={[['oled','OLED (dark room)'],['lcd','LCD/LED (moderate room)'],['projector','Projector (very dark room)']]} s={s} u={u} />
    {size > 0 && type && <Result>
      <h4>Bias Lighting Setup</h4>
      <p><strong>LED Strip Length Needed:</strong> {ledLength.toFixed(1)} feet ({perimeterInches.toFixed(0)}" perimeter)</p>
      <p><strong>Recommended Brightness:</strong> ~{lumens} lumens/meter</p>
      <p><strong>Color Temperature:</strong> 6500K (D65 — matches video standard white point)</p>
      <p><strong>CRI:</strong> 90+ recommended for accurate color perception</p>
      <p className="mt-2"><strong>Benefits:</strong></p>
      <p className="text-sm">• Reduces eye strain by 60-80%</p>
      <p className="text-sm">• Improves perceived contrast and black levels</p>
      <p className="text-sm">• Reduces bias from wall color reflections</p>
      <p className="mt-2 text-sm text-gray-400">Popular options: MediaLight (most accurate), Luminoodle, Govee (budget). Avoid RGB — stick to 6500K white.</p>
    </Result>}
  </div>
}

export function SmartPowerCalculator() {
  const { s, u } = useToolState()
  const devices = N(s('devices')); const standbyW = N(s('standbyW'), 5); const rate = N(s('rate'), 0.12)
  const annualStandby = devices * standbyW * 24 * 365 / 1000
  const annualCost = annualStandby * rate
  return <div>
    <Input label="Number of AV Devices" k="devices" ph="6" unit="devices" s={s} u={u} />
    <Input label="Average Standby Power" k="standbyW" ph="5" unit="watts each" s={s} u={u} />
    <Input label="Electricity Rate" k="rate" ph="0.12" unit="$/kWh" s={s} u={u} />
    {devices > 0 && <Result>
      <h4>Phantom Power Cost</h4>
      <p><strong>Total Standby Draw:</strong> {(devices * standbyW).toFixed(0)}W (24/7)</p>
      <p><strong>Annual Phantom Energy:</strong> {annualStandby.toFixed(0)} kWh</p>
      <p><strong>Annual Phantom Cost:</strong> ${annualCost.toFixed(2)}/year</p>
      <p className="mt-2"><strong>Solution:</strong> Use a smart power strip — cuts standby to $0 when theater is off.</p>
      <p className="text-sm text-gray-400">Average AV device uses 3-8W in standby. A 6-device theater wastes ~250 kWh/year ($30+) on phantom power.</p>
    </Result>}
  </div>
}

export function IrVsIpControlGuide() {
  const { s, u } = useToolState()
  const setup = s('setup')
  const recs: Record<string, { method: string; pros: string; cons: string; products: string }> = {
    'simple': { method: 'IR (Infrared) Blaster + Universal Remote', pros: 'Cheap, works with everything, no network needed', cons: 'Line of sight required, limited two-way feedback', products: 'Logitech Harmony (used), SofaBaton U2, Broadlink RM4' },
    'moderate': { method: 'IP Control + Smart Remote', pros: 'No line of sight, two-way status, works through walls', cons: 'Not all devices support IP control, network dependency', products: 'SofaBaton X1, Logitech Harmony Hub (used), Home Assistant' },
    'advanced': { method: 'Control4 / Crestron / Savant', pros: 'Professional-grade, rock-solid reliability, beautiful interfaces', cons: 'Expensive ($2K-10K+), requires dealer installation', products: 'Control4 EA-1, Crestron TSR-310, Savant Pro' },
  }
  return <div>
    <Select label="Setup Complexity" k="setup" options={[['simple','Simple (budget)'],['moderate','Moderate (enthusiast)'],['advanced','Advanced (professional)']]} s={s} u={u} />
    {setup && recs[setup] && <Result>
      <h4>Recommended: {recs[setup].method}</h4>
      <p><strong>Pros:</strong> {recs[setup].pros}</p>
      <p><strong>Cons:</strong> {recs[setup].cons}</p>
      <p><strong>Products:</strong> {recs[setup].products}</p>
    </Result>}
  </div>
}
