import { motion } from 'framer-motion'

const W = 800
const H = 400
const PAD_TOP = 40
const PAD_BOTTOM = 46
const BAR_W = 120

// 漲幅拆解瀑布圖：起點股價 + EPS 貢獻 + 本益比貢獻 = 終點股價
// EPS 貢獻 = ΔEPS × 起點本益比；本益比貢獻 = 終點EPS × Δ本益比（兩塊加總恰好等於價差）
export default function PriceBridge({ priceStart, priceEnd, epsStart, epsEnd }) {
  const peStart = priceStart / epsStart
  const peEnd = priceEnd / epsEnd
  const epsContrib = (epsEnd - epsStart) * peStart
  const peContrib = epsEnd * (peEnd - peStart)

  const maxV = Math.max(priceStart, priceEnd) * 1.08
  const plotH = H - PAD_TOP - PAD_BOTTOM
  const y = (v) => PAD_TOP + plotH * (1 - v / maxV)
  const hOf = (v) => (plotH * v) / maxV

  const bars = [
    { name: '起點股價', top: priceStart, base: 0, value: priceStart, color: '#52514e', prefix: '' },
    { name: 'EPS 預期上修', top: priceStart + epsContrib, base: priceStart, value: epsContrib, color: '#3987e5', prefix: '+' },
    { name: '本益比重估', top: priceEnd, base: priceStart + epsContrib, value: peContrib, color: '#199e70', prefix: '+' },
    { name: '終點股價', top: priceEnd, base: 0, value: priceEnd, color: '#9ec5f4', prefix: '' },
  ]
  const xs = bars.map((_, i) => 60 + i * ((W - 120 - BAR_W) / (bars.length - 1)))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="bridge-svg" role="img" aria-label="漲幅拆解瀑布圖">
      {/* 基準線 */}
      <line x1="40" x2={W - 40} y1={y(0)} y2={y(0)} stroke="#383835" strokeWidth="1" />

      {bars.map((b, i) => (
        <g key={b.name}>
          {/* 連接虛線：上一根柱的頂 → 這一根柱 */}
          {i > 0 && (
            <motion.line
              x1={xs[i - 1] + BAR_W}
              x2={xs[i] + BAR_W / 2}
              y1={y(bars[i - 1].top)}
              y2={y(bars[i - 1].top)}
              stroke="#52514e"
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.45 }}
            />
          )}
          <motion.rect
            x={xs[i]}
            width={BAR_W}
            rx="4"
            fill={b.color}
            initial={{ y: y(b.base), height: 0 }}
            animate={{ y: y(b.top), height: hOf(b.top - b.base) }}
            transition={{ delay: 0.4 + i * 0.45, duration: 0.5, ease: 'easeOut' }}
          />
          <motion.text
            x={xs[i] + BAR_W / 2}
            y={y(b.top) - 10}
            textAnchor="middle"
            className="bridge-value"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.45 }}
          >
            {b.prefix}
            {Math.round(b.value)}
          </motion.text>
          <text x={xs[i] + BAR_W / 2} y={H - 22} textAnchor="middle" className="bridge-name">
            {b.name}
          </text>
          <text x={xs[i] + BAR_W / 2} y={H - 6} textAnchor="middle" className="bridge-sub">
            {i === 1 && `${epsStart} → ${epsEnd} 元`}
            {i === 2 && `${peStart.toFixed(1)} → ${peEnd.toFixed(1)} 倍`}
          </text>
        </g>
      ))}
    </svg>
  )
}
