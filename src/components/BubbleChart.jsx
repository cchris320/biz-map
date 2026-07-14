import { useState } from 'react'
import { motion } from 'framer-motion'

const W = 800
const H = 340
const PAD = { top: 36, right: 24, bottom: 34, left: 64 }

// 泡沫價格曲線：單一序列折線 + 頂點標註；對數刻度呈現倍數行情
export default function BubbleChart({ prices }) {
  const [tip, setTip] = useState(null)
  const { points, unit, log } = prices

  const vals = points.map((p) => (log ? Math.log10(p.v) : p.v))
  const vMin = Math.min(...vals)
  const vMax = Math.max(...vals)
  const span = vMax - vMin || 1

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (plotW * i) / (points.length - 1)
  const y = (p) => {
    const v = log ? Math.log10(p.v) : p.v
    return PAD.top + plotH * (1 - (v - vMin) / span)
  }

  const peak = points.reduce((m, p, i) => (p.v > points[m].v ? i : m), 0)
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p)}`).join('')
  const area = `${path}L${x(points.length - 1)},${H - PAD.bottom}L${x(0)},${H - PAD.bottom}Z`

  // 四條水平格線的參考值
  const gridVals = [0, 1 / 3, 2 / 3, 1].map((t) => {
    const v = vMin + span * t
    return log ? Math.pow(10, v) : v
  })

  return (
    <div className="bubble-chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="bubble-chart-svg" role="img" aria-label={`${unit}走勢圖`}>
        {gridVals.map((v, i) => {
          const gy = PAD.top + plotH * (1 - i / 3)
          return (
            <g key={i}>
              <line x1={PAD.left} x2={W - PAD.right} y1={gy} y2={gy} stroke="#2c2c2a" strokeWidth="1" />
              <text x={PAD.left - 8} y={gy + 4} textAnchor="end" className="chart-tick">
                {Math.round(v).toLocaleString()}
              </text>
            </g>
          )
        })}

        <motion.path
          d={area}
          fill="rgba(57, 135, 229, 0.10)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#3987e5"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={x(i)}
              cy={y(p)}
              r="10"
              fill="transparent"
              onMouseEnter={() => setTip(i)}
              onMouseLeave={() => setTip(null)}
            />
            <circle cx={x(i)} cy={y(p)} r={i === peak ? 5 : 3} fill={i === peak ? '#e34948' : '#3987e5'} pointerEvents="none" />
            {(i === 0 || i === peak || i === points.length - 1 || i % 2 === 0) && (
              <text x={x(i)} y={H - PAD.bottom + 18} textAnchor="middle" className="chart-tick">
                {p.t}
              </text>
            )}
          </g>
        ))}

        {/* 頂點標註 */}
        <motion.text
          x={x(peak)}
          y={y(points[peak]) - 14}
          textAnchor={peak > points.length * 0.7 ? 'end' : 'middle'}
          className="chart-peak-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          頂點 {points[peak].v.toLocaleString()}（{points[peak].t}）
        </motion.text>

        {tip !== null && (
          <text x={x(tip)} y={y(points[tip]) - (tip === peak ? 30 : 12)} textAnchor="middle" className="chart-tip-text">
            {points[tip].t}：{points[tip].v.toLocaleString()}
          </text>
        )}
      </svg>
      <p className="chart-caption">
        {unit}
        {log ? '（對數刻度：每一格代表相同的漲跌倍數）' : ''}
      </p>
    </div>
  )
}
