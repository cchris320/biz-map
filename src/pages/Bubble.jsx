import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { bubbles, getBubble } from '../data'
import BubbleChart from '../components/BubbleChart'

const ANATOMY = [
  { key: 'narrative', label: '新敘事是什麼' },
  { key: 'money', label: '錢從哪來（槓桿）' },
  { key: 'valuation', label: '估值多誇張' },
  { key: 'reflexivity', label: '反身性迴圈' },
  { key: 'trigger', label: '刺破點' },
]

export default function Bubble() {
  const { id } = useParams()
  const b = getBubble(id)

  if (!b) {
    return (
      <div className="not-found">
        <p>還沒有這場泡沫的資料</p>
        <Link to="/">← 回首頁</Link>
      </div>
    )
  }

  const idx = bubbles.findIndex((x) => x.id === id)
  const prev = bubbles[idx - 1]
  const next = bubbles[idx + 1]

  return (
    <div className="case-page bubble-page">
      <header>
        <Link to="/" className="back-link">
          ← 首頁
        </Link>
        <div className="bubble-meta">
          {b.period}・{b.place}
        </div>
        <h1>{b.name}</h1>
        <p className="case-subtitle">{b.oneLiner}</p>
      </header>

      <motion.div
        className="multiplier-row"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {b.stats.map((s) => (
          <div key={s.label} className="multiplier">
            <div className="multiplier-value stat">{s.value}</div>
            <div className="multiplier-name">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="bridge-wrap">
        <BubbleChart prices={b.prices} />
      </div>

      <section className="timeline-section">
        <h2>事情是怎麼發生的</h2>
        <div className="timeline">
          {b.phases.map((p) => (
            <motion.div
              key={p.name}
              className="timeline-item"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
            >
              <div className="timeline-date">
                {p.name}
                <span className="phase-title">{p.title}</span>
              </div>
              <p>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="anatomy-section">
        <h2>泡沫解剖</h2>
        <p className="anatomy-intro">
          用跟個股案例同一副眼鏡：泡沫就是「願付倍數」（本益比）極端擴張的集體版本。五個固定問題，每場泡沫都問一遍。
        </p>
        <div className="anatomy-grid">
          {ANATOMY.map((a) => (
            <motion.div
              key={a.key}
              className="anatomy-card"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
            >
              <h3>{a.label}</h3>
              <p>{b.anatomy[a.key]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="insight-box takeaway">
        <h3>帶走的觀念</h3>
        <p>{b.takeaway}</p>
      </div>

      <p className="data-note">{b.dataNote}</p>

      <div className="sources">
        <h3>延伸閱讀</h3>
        <ul>
          {b.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="bubble-nav">
        {prev ? (
          <Link to={`/bubble/${prev.id}`}>← {prev.name}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/bubble/${next.id}`}>{next.name} →</Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
