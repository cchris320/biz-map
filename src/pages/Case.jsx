import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCase, getCompany } from '../data'
import PriceBridge from '../components/PriceBridge'

const TAG_STYLE = {
  EPS: { background: 'rgba(57, 135, 229, 0.15)', color: '#5598e7' },
  PE: { background: 'rgba(25, 158, 112, 0.15)', color: '#1baf7a' },
}
const TAG_LABEL = { EPS: 'EPS 預期', PE: '本益比' }

export default function Case() {
  const { ticker } = useParams()
  const c = getCase(ticker)
  const company = getCompany(ticker)

  if (!c) {
    return (
      <div className="not-found">
        <p>還沒有這個案例</p>
        <Link to="/">← 回產業列表</Link>
      </div>
    )
  }

  const totalX = c.priceEnd / c.priceStart
  const epsX = c.epsEnd / c.epsStart
  const peX = totalX / epsX

  return (
    <div className="case-page">
      <header>
        <Link to={`/company/${c.ticker}`} className="back-link">
          ← {c.name}金流拆解
        </Link>
        <h1>{c.title}</h1>
        <p className="case-subtitle">{c.subtitle}</p>
        <p className="case-period">{c.period}</p>
      </header>

      {/* 乘數等式 */}
      <motion.div
        className="multiplier-row"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="multiplier total">
          <div className="multiplier-value">×{totalX.toFixed(2)}</div>
          <div className="multiplier-name">總漲幅</div>
          <div className="multiplier-sub">
            {c.priceStart} → {c.priceEnd} 元
          </div>
        </div>
        <div className="multiplier-op">=</div>
        <div className="multiplier eps">
          <div className="multiplier-value">×{epsX.toFixed(2)}</div>
          <div className="multiplier-name">EPS 預期上修</div>
          <div className="multiplier-sub">
            {c.epsStart} → {c.epsEnd} 元
          </div>
        </div>
        <div className="multiplier-op">×</div>
        <div className="multiplier pe">
          <div className="multiplier-value">×{peX.toFixed(2)}</div>
          <div className="multiplier-name">本益比重估</div>
          <div className="multiplier-sub">
            {(c.priceStart / c.epsStart).toFixed(1)} → {(c.priceEnd / c.epsEnd).toFixed(1)} 倍
          </div>
        </div>
      </motion.div>

      <div className="bridge-wrap">
        <PriceBridge
          priceStart={c.priceStart}
          priceEnd={c.priceEnd}
          epsStart={c.epsStart}
          epsEnd={c.epsEnd}
        />
        <p className="bridge-note">
          {c.epsStartNote}；{c.epsEndNote}。
        </p>
      </div>

      {/* 事件時間軸 */}
      <section className="timeline-section">
        <h2>發生了什麼</h2>
        <div className="timeline">
          {c.events.map((e, i) => (
            <motion.div
              key={i}
              className="timeline-item"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
            >
              <div className="timeline-date">
                {e.date}
                <span className="timeline-tags">
                  {e.tags.map((t) => (
                    <span key={t} className="timeline-tag" style={TAG_STYLE[t]}>
                      {TAG_LABEL[t]}
                    </span>
                  ))}
                </span>
              </div>
              <p>{e.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {company && (
        <div className="insight-box">
          <h3>連回金流圖</h3>
          <p>{c.sankeyNote}</p>
          <Link to={`/company/${c.ticker}`} className="sankey-link">
            看{c.name}的金流拆解 →
          </Link>
        </div>
      )}

      <div className="insight-box takeaway">
        <h3>帶走的觀念</h3>
        <p>{c.takeaway}</p>
      </div>

      <p className="data-note">{c.dataNote}</p>
      <div className="sources">
        <h3>資料來源</h3>
        <ul>
          {c.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
