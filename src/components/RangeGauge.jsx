import { motion } from 'framer-motion'

// 區間量表：灰帶 = 歷史常態區間，圓點 = 現值；超出上緣顯示紅色
export default function RangeGauge({ ind }) {
  const { label, value, unit, scaleMin, scaleMax, bandLow, bandHigh, bandLabel, note } = ind
  const pct = (v) => ((v - scaleMin) / (scaleMax - scaleMin)) * 100
  const clamp = (p) => Math.max(0, Math.min(100, p))
  const over = value > bandHigh
  const markerColor = over ? '#e34948' : value < bandLow ? '#898781' : '#3987e5'

  return (
    <div className="gauge">
      <div className="gauge-head">
        <span className="gauge-label">{label}</span>
        <span className="gauge-value" style={{ color: markerColor }}>
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <div className="gauge-track">
        <div
          className="gauge-band"
          style={{ left: `${clamp(pct(bandLow))}%`, width: `${clamp(pct(bandHigh)) - clamp(pct(bandLow))}%` }}
        />
        <motion.div
          className="gauge-marker"
          style={{ background: markerColor }}
          initial={{ left: `${clamp(pct(bandLow))}%` }}
          animate={{ left: `${clamp(pct(value))}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
      <div className="gauge-scale">
        <span>{scaleMin.toLocaleString()}</span>
        <span className="gauge-band-label">{bandLabel}</span>
        <span>{scaleMax.toLocaleString()}</span>
      </div>
      <p className="gauge-note">{note}</p>
    </div>
  )
}
