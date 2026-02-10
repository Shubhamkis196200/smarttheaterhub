import type { ToolComponent } from './shared'
import * as Room from './RoomSetupTools'
import * as Audio from './AudioTools'
import * as Video from './VideoDisplayTools'
import * as Budget from './BudgetShoppingTools'
import * as Connectivity from './ConnectivityTools'
import * as SmartHome from './SmartHomeTools'

export const toolRegistry: Record<string, ToolComponent> = {
  // Room & Setup
  'screen-size-calculator': Room.ScreenSizeCalculator,
  'projector-throw-distance': Room.ProjectorThrowDistance,
  'speaker-placement-guide': Room.SpeakerPlacementGuide,
  'room-acoustics-calculator': Room.RoomAcousticsCalculator,
  'seating-distance-calculator': Room.SeatingDistanceCalculator,
  'subwoofer-placement': Room.SubwooferPlacement,
  'aspect-ratio-calculator': Room.AspectRatioCalculator,
  'screen-gain-calculator': Room.ScreenGainCalculator,
  'cable-length-calculator': Room.CableLengthCalculator,
  'hdmi-bandwidth-calculator': Room.HdmiBandwidthCalculator,
  'power-consumption-calculator': Room.PowerConsumptionCalculator,
  'btu-calculator': Room.BtuCalculator,
  'wire-gauge-calculator': Room.WireGaugeCalculator,
  'mounting-height-calculator': Room.MountingHeightCalculator,
  'room-volume-calculator': Room.RoomVolumeCalculator,
  // Audio
  'speaker-impedance-calculator': Audio.SpeakerImpedanceCalculator,
  'amplifier-power-calculator': Audio.AmplifierPowerCalculator,
  'crossover-frequency-calculator': Audio.CrossoverFrequencyCalculator,
  'decibel-calculator': Audio.DecibelCalculator,
  'audio-delay-calculator': Audio.AudioDelayCalculator,
  'frequency-response-visualizer': Audio.FrequencyResponseVisualizer,
  'thx-reference-level': Audio.ThxReferenceLevel,
  'dolby-atmos-channel-calculator': Audio.DolbyAtmosChannelCalculator,
  'equalizer-preset-generator': Audio.EqualizerPresetGenerator,
  'sound-isolation-calculator': Audio.SoundIsolationCalculator,
  'bass-trap-calculator': Audio.BassTrapCalculator,
  'speaker-sensitivity-calculator': Audio.SpeakerSensitivityCalculator,
  'bi-amp-gain-calculator': Audio.BiAmpGainCalculator,
  'subwoofer-crossover-guide': Audio.SubwooferCrossoverGuide,
  'room-eq-wizard-guide': Audio.RoomEqWizardGuide,
  // Video & Display
  'resolution-comparison': Video.ResolutionComparison,
  'hdr-format-checker': Video.HdrFormatChecker,
  'refresh-rate-calculator': Video.RefreshRateCalculator,
  'color-space-visualizer': Video.ColorSpaceVisualizer,
  'input-lag-database': Video.InputLagDatabase,
  'contrast-ratio-calculator': Video.ContrastRatioCalculator,
  'projector-lumens-calculator': Video.ProjectorLumensCalculator,
  'tv-calibration-guide': Video.TvCalibrationGuide,
  'gaming-mode-checker': Video.GamingModeChecker,
  'burn-in-risk-calculator': Video.BurnInRiskCalculator,
  // Budget & Shopping
  'budget-planner': Budget.BudgetPlanner,
  'price-per-inch': Budget.PricePerInch,
  'cost-per-year': Budget.CostPerYear,
  'streaming-service-calculator': Budget.StreamingServiceCalculator,
  'equipment-comparison': Budget.EquipmentComparison,
  'upgrade-priority-planner': Budget.UpgradePriorityPlanner,
  'used-equipment-estimator': Budget.UsedEquipmentEstimator,
  'black-friday-tracker': Budget.BlackFridayTracker,
  'warranty-comparison': Budget.WarrantyComparison,
  'energy-star-calculator': Budget.EnergyStarCalculator,
  // Connectivity
  'wifi-signal-calculator': Connectivity.WifiSignalCalculator,
  'network-bandwidth-calculator': Connectivity.NetworkBandwidthCalculator,
  'hdmi-arc-guide': Connectivity.HdmiArcGuide,
  'ethernet-vs-wifi': Connectivity.EthernetVsWifiComparison,
  'bluetooth-codec-checker': Connectivity.BluetoothCodecChecker,
  // Smart Home
  'smart-scene-planner': SmartHome.SmartHomeScenePlanner,
  'voice-assistant-comparison': SmartHome.VoiceAssistantComparison,
  'bias-lighting-calculator': SmartHome.BiasLightingCalculator,
  'smart-power-calculator': SmartHome.SmartPowerCalculator,
  'ir-vs-ip-control': SmartHome.IrVsIpControlGuide,
}
