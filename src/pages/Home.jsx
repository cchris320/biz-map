import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { bubbles, industries, upcoming } from '../data'

export default function Home() {
  return (
    <div className="home">
      <header className="home-hero">
        <h1>錢從哪裡來</h1>
        <p>
          每個產業都是一條供應鏈：誰做什麼、誰付錢給誰、誰賺走最多。
          <br />
          點進一個產業，跟著金流走一遍。
        </p>
      </header>

      <div className="feature-row">
        <Link to="/market" className="feature-link">
          <span className="feature-icon">🌡️</span>
          <span>
            <strong>市場溫度計</strong>
            <em>進場前，先看自己站在哪裡：估值、槓桿、泡沫五問對照當下</em>
          </span>
        </Link>
        <Link to="/concept" className="feature-link">
          <span className="feature-icon">⚙️</span>
          <span>
            <strong>股價為什麼會漲</strong>
            <em>EPS × 本益比：兩個拉桿玩懂四種上漲劇本</em>
          </span>
        </Link>
        <Link to="/listening" className="feature-link">
          <span className="feature-icon">🎧</span>
          <span>
            <strong>投資節目怎麼聽</strong>
            <em>事實、框架、預測——用三層過濾器拆一集股癌</em>
          </span>
        </Link>
      </div>

      <div className="industry-grid">
        {industries.map((ind, i) => (
          <motion.div
            key={ind.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={`/industry/${ind.id}`} className="industry-card">
              <h2>{ind.name}</h2>
              <p>{ind.oneLiner}</p>
              <span className="card-cta">看供應鏈 →</span>
            </Link>
          </motion.div>
        ))}
        {upcoming.map((ind, i) => (
          <motion.div
            key={ind.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (industries.length + i) * 0.08 }}
          >
            <div className="industry-card upcoming">
              <h2>{ind.name}</h2>
              <p>{ind.oneLiner}</p>
              <span className="card-cta">即將推出</span>
            </div>
          </motion.div>
        ))}
      </div>

      <header className="section-head">
        <h2>泡沫博物館</h2>
        <p>
          每一場泡沫，都是「市場願付的倍數」極端擴張再崩塌的故事。七場歷史，同一套解剖框架。
        </p>
      </header>

      <div className="bubble-grid">
        {bubbles.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: (i % 4) * 0.06 }}
          >
            <Link to={`/bubble/${b.id}`} className="industry-card bubble-card">
              <div className="bubble-card-period">
                {b.period}・{b.place}
              </div>
              <h2>{b.name}</h2>
              <p>{b.oneLiner}</p>
              <div className="bubble-card-stats">
                {b.stats.slice(0, 2).map((s) => (
                  <span key={s.label}>
                    {s.label} <strong>{s.value}</strong>
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
