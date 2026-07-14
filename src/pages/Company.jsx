import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { companies, getCase, getCompany, getIndustry } from '../data'
import MoneySankey from '../components/MoneySankey'

export default function Company() {
  const { ticker } = useParams()
  const company = getCompany(ticker)

  if (!company) {
    return (
      <div className="not-found">
        <p>還沒有這家公司的金流資料</p>
        <Link to="/">← 回產業列表</Link>
      </div>
    )
  }

  const industry = getIndustry(company.industry)
  const peers = companies.filter((c) => c.industry === company.industry)

  return (
    <div className="company-page">
      <header className="company-header">
        <Link to={`/industry/${company.industry}`} className="back-link">
          ← {industry?.name}供應鏈
        </Link>
        <h1>
          {company.name}
          <span className="company-ticker-big">{company.ticker}</span>
        </h1>
        <p className="company-oneliner">{company.oneLiner}</p>

        <div className="peer-switcher">
          {peers.map((p) => (
            <Link
              key={p.ticker}
              to={`/company/${p.ticker}`}
              className={`peer-chip${p.ticker === company.ticker ? ' active' : ''}`}
            >
              {p.name}
            </Link>
          ))}
        </div>
      </header>

      <motion.div
        key={company.ticker}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <MoneySankey pnl={company.pnl} unit={company.unit} />

        <div className="insight-box">
          <h3>怎麼讀這張圖</h3>
          <p>{company.insight}</p>
        </div>

        {getCase(company.ticker) && (
          <Link to={`/case/${company.ticker}`} className="case-banner">
            <span>📈 {getCase(company.ticker).subtitle}</span>
            <span className="card-cta">看漲幅剖析 →</span>
          </Link>
        )}

        <p className="data-note">
          數字為 {company.year} 年約略值（單位：{company.unit}），用來理解商業模式，非即時財報數據。
        </p>
      </motion.div>
    </div>
  )
}
