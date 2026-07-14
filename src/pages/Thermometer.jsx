import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import market from '../data/market.json'
import RangeGauge from '../components/RangeGauge'

const STATUS = {
  on: { icon: '●', color: '#e34948', label: '亮燈' },
  half: { icon: '◐', color: '#eda100', label: '半亮' },
  off: { icon: '○', color: '#898781', label: '未亮' },
}

// 預設情境：一鍵擺好拉桿，看懂計算機怎麼用
const SCENARIOS = [
  { label: '樂觀：企業獲利兌現、倍數不變', pe: 31.3, g: 20, hint: 'AI 假設鏈全部成立，市場也繼續買單' },
  { label: '中性：企業獲利兌現、倍數正常化', pe: 23, g: 20, hint: '公司做到了，但市場不再付溢價——很多人以為會漲，算算看' },
  { label: '倍數回到歷史上緣', pe: 23, g: 0, hint: '獲利完全沒變，只是市場心情回到常態' },
  { label: '倍數回到歷史中樞', pe: 18, g: 0, hint: '不需要任何壞消息，只需要激情退場' },
  { label: '衰退 + 恐慌', pe: 14, g: -15, hint: '獲利下修遇上倍數收縮——2008 的組合' },
]

export default function Thermometer() {
  const [pe, setPe] = useState(market.pe)
  const [growth, setGrowth] = useState(0)

  const implied = market.index * (pe / market.pe) * (1 + growth / 100)
  const change = implied / market.index - 1
  // 台股慣例：紅漲綠跌
  const changeColor = change > 0.001 ? '#e34948' : change < -0.001 ? '#1baf7a' : 'var(--ink)'

  return (
    <div className="case-page thermo-page">
      <header>
        <Link to="/" className="back-link">
          ← 首頁
        </Link>
        <h1>市場溫度計</h1>
        <p className="case-subtitle">{market.intro}</p>
        <p className="case-period">資料日期：{market.asOf}・加權指數約 {market.index.toLocaleString()} 點</p>
      </header>

      <section>
        <h2 className="thermo-h2">現在的位置</h2>
        <div className="gauge-grid">
          {market.indicators.map((ind) => (
            <RangeGauge key={ind.id} ind={ind} />
          ))}
        </div>
      </section>

      <section className="anatomy-section">
        <h2>泡沫五問，對照當下</h2>
        <p className="anatomy-intro">
          用泡沫博物館的同一套解剖框架掃描現在。亮燈不是預言，是「這個特徵存在」的事實陳述。
        </p>
        <div className="checklist">
          {market.checklist.map((c) => {
            const s = STATUS[c.status]
            return (
              <motion.div
                key={c.question}
                className="checklist-row"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="checklist-icon" style={{ color: s.color }}>
                  {s.icon}
                </span>
                <div>
                  <div className="checklist-q">
                    {c.question}
                    <span className="checklist-status" style={{ color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  <p>{c.text}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="insight-box">
          <h3>讀溫度計的方法</h3>
          <p>{market.checklistNote}</p>
        </div>
      </section>

      <section className="anatomy-section">
        <h2>情境計算機：你的假設值多少點</h2>
        <p className="anatomy-intro">
          用法三步驟：<strong>① 點一個情境</strong>（或自己拉桿）→ <strong>② 看右邊的隱含點位</strong> →{' '}
          <strong>③ 問自己：這個結果發生時，我的部位撐得住嗎？</strong>
          指數 = 現在的點位 × 倍數變化 × 獲利變化，假設是你的，這裡只負責數學。
        </p>
        <div className="scenario-chips">
          {SCENARIOS.map((s) => (
            <button
              key={s.label}
              className={`scenario-chip${pe === s.pe && growth === s.g ? ' active' : ''}`}
              onClick={() => {
                setPe(s.pe)
                setGrowth(s.g)
              }}
              title={s.hint}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="calc-box">
          <div className="calc-sliders">
            <label>
              <span className="calc-label">
                假設本益比回到 <strong>{pe.toFixed(1)} 倍</strong>
                <span className="calc-hint">（現在 {market.pe} 倍・歷史區間 13–23）</span>
              </span>
              <input
                type="range"
                min="10"
                max="40"
                step="0.5"
                value={pe}
                onChange={(e) => setPe(Number(e.target.value))}
              />
            </label>
            <label>
              <span className="calc-label">
                假設企業獲利（EPS）成長 <strong>{growth > 0 ? '+' : ''}{growth}%</strong>
                <span className="calc-hint">（指上市公司賺的錢，不是投資人的損益）</span>
              </span>
              <input
                type="range"
                min="-40"
                max="60"
                step="5"
                value={growth}
                onChange={(e) => setGrowth(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="calc-result">
            <div className="calc-implied" style={{ color: changeColor }}>
              {Math.round(implied).toLocaleString()} 點
            </div>
            <div className="calc-change" style={{ color: changeColor }}>
              {change > 0 ? '+' : ''}
              {(change * 100).toFixed(1)}%
            </div>
            <div className="calc-note">相對 {market.index.toLocaleString()} 點</div>
          </div>
        </div>
        <p className="data-note">
          最值得試的是「中性」情境：企業獲利 +20% 如期兌現、倍數只是回到歷史上緣——算出來仍是負的。這就是高檔進場的真相：
          <strong>公司做對了所有事，你也可能不賺錢</strong>，因為你付的價格已經預支了那份成長。
        </p>
      </section>

      <div className="insight-box takeaway">
        <h3>這一頁想說的</h3>
        <p>
          進場永遠是你的自由——這頁的目的只是讓你在進場前知道：你買的價格已經內建了哪些假設、假設鬆動時的代價是幾成、以及歷史上站在同樣位置的人後來付了什麼學費。知道這些之後做的決定，才叫決定。
        </p>
      </div>

      <p className="data-note">
        本頁描述市場位置，不構成任何投資建議與預測。數據更新於 {market.asOf}，過時的數字請以來源網站為準。
      </p>

      <div className="sources">
        <h3>資料來源</h3>
        <ul>
          {market.sources.map((s) => (
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
