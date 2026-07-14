import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { marginColor } from '../lib/colors'
import { getCompany } from '../data'

export default function ProfitBar({ company, metricMax = 75 }) {
  const hasSankey = Boolean(getCompany(company.ticker))
  const barMax = metricMax * 1.07 // 留一點頭，避免最高者撐滿

  return (
    <div className="profit-row">
      <div className="profit-row-head">
        <span className="company-name">
          {company.name}
          <span className="company-ticker">
            {company.market === 'TW' ? company.ticker : `${company.ticker}・美股`}
          </span>
        </span>
        <span className="company-margin">{company.grossMargin}%</span>
      </div>
      <div className="profit-track">
        <motion.div
          className="profit-fill"
          style={{ background: marginColor(company.grossMargin, metricMax) }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (company.grossMargin / barMax) * 100)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <div className="company-note">
        {company.note}
        {hasSankey && (
          <Link to={`/company/${company.ticker}`} className="sankey-link">
            看金流拆解 →
          </Link>
        )}
      </div>
    </div>
  )
}
