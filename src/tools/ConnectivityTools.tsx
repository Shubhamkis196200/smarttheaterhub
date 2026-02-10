import { N, useToolState, Input, Select, Result } from './shared'

export function WifiSignalCalculator() {
  const { s, u } = useToolState()
  const dist = N(s('dist')); const walls = N(s('walls')); const band = s('band') || '5ghz'
  const baseLoss = band === '5ghz' ? 47 : 40 // free space path loss at 1m
  const wallLoss = band === '5ghz' ? 5 : 3 // dB per wall
  const distLoss = dist > 0 ? 20 * Math.log10(dist * 0.3048) : 0
  const totalLoss = baseLoss + distLoss + walls * wallLoss
  const signal = -totalLoss
  return <div>
    <Input label="Distance to Router" k="dist" ph="30" unit="feet" s={s} u={u} />
    <Input label="Walls Between" k="walls" ph="2" unit="walls" s={s} u={u} />
    <Select label="Wi-Fi Band" k="band" options={[['5ghz','5 GHz (faster, shorter range)'],['2.4ghz','2.4 GHz (slower, better range)']]} s={s} u={u} />
    {dist > 0 && <Result>
      <h4>Wi-Fi Signal Estimate</h4>
      <p><strong>Estimated Signal:</strong> {signal.toFixed(0)} dBm</p>
      <p><strong>Quality:</strong> {signal > -50 ? '🟢 Excellent' : signal > -60 ? '🟢 Good' : signal > -70 ? '🟡 Fair — may buffer 4K' : signal > -80 ? '🔴 Weak — buffering likely' : '🔴 Very Weak — unreliable'}</p>
      <p><strong>4K Streaming:</strong> {signal > -65 ? '✅ Should work' : '❌ May need a mesh node or ethernet'}</p>
      <p><strong>Recommendation:</strong> {signal > -60 ? 'Wi-Fi is fine for streaming' : signal > -70 ? 'Consider a Wi-Fi 6 mesh system or move router closer' : 'Use ethernet or add a mesh access point near your theater'}</p>
    </Result>}
  </div>
}

export function NetworkBandwidthCalculator() {
  const { s, u } = useToolState()
  const speed = N(s('speed')); const devices = N(s('devices'), 1)
  const streams4k = speed > 0 ? Math.floor(speed / 25) : 0
  const perDevice = speed > 0 && devices > 0 ? speed / devices : 0
  return <div>
    <Input label="Internet Speed" k="speed" ph="100" unit="Mbps" s={s} u={u} />
    <Input label="Active Devices" k="devices" ph="5" unit="devices" s={s} u={u} />
    {speed > 0 && <Result>
      <h4>Network Bandwidth Analysis</h4>
      <p><strong>Per Device:</strong> {perDevice.toFixed(1)} Mbps</p>
      <p><strong>Max Simultaneous 4K Streams:</strong> {streams4k} (25 Mbps each)</p>
      <p><strong>Max 1080p Streams:</strong> {Math.floor(speed / 5)} (5 Mbps each)</p>
      <p><strong>Dolby Atmos Streaming:</strong> {speed >= 15 ? '✅ Sufficient' : '❌ Need 15+ Mbps'}</p>
      <p className="mt-2"><strong>Recommendations:</strong></p>
      <p>{speed < 25 ? '⚠️ Upgrade internet — 25 Mbps minimum for reliable 4K' : speed < 100 ? '👍 OK for 1-2 simultaneous 4K streams' : speed < 300 ? '✅ Good for multiple 4K streams' : '🌟 Excellent — no bottleneck'}</p>
    </Result>}
  </div>
}

export function HdmiArcGuide() {
  const { s, u } = useToolState()
  const port = s('port')
  const info: Record<string, { name: string; bw: string; audio: string; rec: string }> = {
    'arc': { name: 'HDMI ARC', bw: 'Up to 1 Mbps', audio: 'Dolby Digital, DTS (compressed only)', rec: 'Basic soundbars. No lossless audio.' },
    'earc': { name: 'HDMI eARC', bw: 'Up to 37 Mbps', audio: 'Dolby TrueHD, DTS-HD MA, Dolby Atmos (TrueHD), DTS:X', rec: 'Required for lossless Atmos from TV apps. Use with premium soundbars/AVRs.' },
    'optical': { name: 'Optical (TOSLINK)', bw: 'Up to 3.1 Mbps', audio: 'Dolby Digital, DTS (2-channel PCM max 96kHz)', rec: 'Fallback only. No HD audio formats.' },
  }
  return <div>
    <Select label="Audio Connection" k="port" options={[['arc','HDMI ARC'],['earc','HDMI eARC'],['optical','Optical (TOSLINK)']]} s={s} u={u} />
    {port && info[port] && <Result>
      <h4>{info[port].name}</h4>
      <p><strong>Bandwidth:</strong> {info[port].bw}</p>
      <p><strong>Supported Audio:</strong> {info[port].audio}</p>
      <p><strong>Recommendation:</strong> {info[port].rec}</p>
      <p className="mt-2 text-sm text-gray-400">For the best audio, connect sources directly to your AVR/soundbar, not through the TV. Use eARC only for TV built-in apps.</p>
    </Result>}
  </div>
}

export function EthernetVsWifiComparison() {
  const { s, u } = useToolState()
  const useCase = s('useCase')
  const recs: Record<string, { winner: string; why: string; details: string }> = {
    'streaming': { winner: '🤝 Either works', why: 'Modern Wi-Fi 6 handles 4K streaming fine', details: 'Ethernet is more reliable but Wi-Fi 6 at 5GHz with good signal is sufficient for 4K HDR streaming (25 Mbps).' },
    'gaming': { winner: '🔌 Ethernet wins', why: 'Lower latency, no jitter', details: 'Ethernet: 1-3ms latency, 0 jitter. Wi-Fi: 5-20ms latency with occasional spikes. For competitive gaming, always use ethernet.' },
    'multiroom': { winner: '📶 Wi-Fi/Mesh wins', why: 'Easier to deploy across rooms', details: 'Running ethernet to every room is ideal but impractical for most. A Wi-Fi 6E mesh system is the pragmatic choice for multi-room audio/video.' },
    'reliability': { winner: '🔌 Ethernet wins', why: 'Zero interference, consistent speed', details: 'Ethernet is immune to interference. Critical for live sports or uninterrupted movie nights. Consider MoCA adapters if you have coax.' },
  }
  return <div>
    <Select label="Primary Use Case" k="useCase" options={[['streaming','4K/HDR Streaming'],['gaming','Gaming'],['multiroom','Multi-Room Setup'],['reliability','Maximum Reliability']]} s={s} u={u} />
    {useCase && recs[useCase] && <Result>
      <h4>Ethernet vs Wi-Fi: {recs[useCase].winner}</h4>
      <p><strong>Why:</strong> {recs[useCase].why}</p>
      <p>{recs[useCase].details}</p>
    </Result>}
  </div>
}

export function BluetoothCodecChecker() {
  const { s, u } = useToolState()
  const codec = s('codec')
  const codecs: Record<string, { quality: string; latency: string; bitrate: string; verdict: string }> = {
    'sbc': { quality: '⭐⭐ Basic', latency: '150-250ms', bitrate: '198-345 kbps', verdict: 'Default fallback. Noticeable compression. Not ideal for theater.' },
    'aac': { quality: '⭐⭐⭐ Good', latency: '100-200ms', bitrate: '256 kbps', verdict: 'Good for Apple devices. Better than SBC but still lossy.' },
    'aptx': { quality: '⭐⭐⭐ Good', latency: '60-80ms', bitrate: '352 kbps', verdict: 'Low latency, decent quality. OK for casual TV watching.' },
    'aptxhd': { quality: '⭐⭐⭐⭐ Very Good', latency: '60-80ms', bitrate: '576 kbps', verdict: 'Near CD-quality. Good for music, acceptable for movies.' },
    'ldac': { quality: '⭐⭐⭐⭐⭐ Excellent', latency: '100-200ms', bitrate: 'Up to 990 kbps', verdict: 'Best Bluetooth audio quality. Higher latency may cause lip-sync issues with video.' },
    'lc3plus': { quality: '⭐⭐⭐⭐ Very Good', latency: '20-30ms', bitrate: '128-400 kbps', verdict: 'LE Audio (Bluetooth 5.2+). Best latency, good quality. Future standard.' },
  }
  return <div>
    <Select label="Bluetooth Codec" k="codec" options={[['sbc','SBC'],['aac','AAC'],['aptx','aptX'],['aptxhd','aptX HD'],['ldac','LDAC'],['lc3plus','LC3plus (LE Audio)']]} s={s} u={u} />
    {codec && codecs[codec] && <Result>
      <h4>{codec.toUpperCase()} Codec Details</h4>
      <p><strong>Quality:</strong> {codecs[codec].quality}</p>
      <p><strong>Latency:</strong> {codecs[codec].latency}</p>
      <p><strong>Bitrate:</strong> {codecs[codec].bitrate}</p>
      <p><strong>For Home Theater:</strong> {codecs[codec].verdict}</p>
      <p className="mt-2 text-sm text-gray-400">For critical movie watching, wired connections or WiSA wireless speakers are preferred over Bluetooth.</p>
    </Result>}
  </div>
}
