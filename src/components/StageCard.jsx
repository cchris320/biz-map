import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProfitBar from './ProfitBar'

// 點擊節點後滑出的說明面板
export default function StageCard({ stage, metricLabel = '毛利率', metricMax = 75, onClose }) {
  return (
    <motion.aside
      className="stage-card"
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
    >
      <button className="card-close" onClick={onClose} aria-label="關閉">
        ✕
      </button>
      <div className="card-tier">{stage.tier}</div>
      <h2>{stage.name}</h2>
      <p className="card-role">{stage.role}</p>

      <h3>怎麼賺錢</h3>
      <p>{stage.howTheyEarn}</p>

      <h3>誰賺得多、為什麼</h3>
      <p>{stage.marginStory}</p>

      {stage.shift && (
        <div className="shift-box">
          <div className="shift-box-title">↗ {stage.shift.label}</div>
          <p>{stage.shift.note}</p>
          <Link to={`/case/${stage.shift.case}`} className="sankey-link">
            看這段行情的完整剖析 →
          </Link>
        </div>
      )}

      {stage.companies.length > 0 && (
        <>
          <h3>代表公司（{metricLabel}）</h3>
          {stage.companies.map((c) => (
            <ProfitBar key={c.ticker} company={c} metricMax={metricMax} />
          ))}
        </>
      )}
    </motion.aside>
  )
}
