import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const BASE = { eps: 10, pe: 15 } // 基準：EPS 10 元、本益比 15 倍 → 股價 150

const SCRIPTS = [
  {
    id: 'growth',
    name: '成長股',
    move: 'E 動、P/E 不動',
    eps: 20,
    pe: 15,
    desc: '獲利翻倍、市場給的倍數不變，股價跟著獲利走。最健康的漲法——但前提是成長要一直兌現。',
    example: { label: '例：台積電的金流結構', to: '/company/2330' },
  },
  {
    id: 'rerate',
    name: '重估股',
    move: 'P/E 大動、E 小動',
    eps: 12,
    pe: 28,
    desc: '市場改變了「它是誰」的認定，同一份獲利願意付更高倍數。漲得最快，但倍數是情緒，情緒會退潮。',
    example: { label: '例：日月光 250 → 671 的拆解', to: '/case/3711' },
  },
  {
    id: 'cyclical',
    name: '景氣循環股',
    move: 'E 暴衝、P/E 反向收縮',
    eps: 30,
    pe: 7,
    desc: '獲利暴衝但市場知道好景不常，反而把倍數壓低——「獲利最好的一年，本益比最低」是循環股的正字標記。',
    example: { label: '例：長榮——毛利率是運價的快照', to: '/company/2603' },
  },
  {
    id: 'yield',
    name: '定存股',
    move: 'E、P/E 都不太動',
    eps: 10,
    pe: 16,
    desc: '股價幾乎不動，報酬來自年復一年的配息。買的不是成長，是現金流的穩定性——電信、公用事業是典型。',
    example: { label: '例：中華電信的金流結構', to: '/company/2412' },
  },
]

export default function Concept() {
  const [eps, setEps] = useState(BASE.eps)
  const [pe, setPe] = useState(BASE.pe)
  const [active, setActive] = useState(null)

  const price = eps * pe
  const basePrice = BASE.eps * BASE.pe
  const totalX = price / basePrice
  const epsX = eps / BASE.eps
  const peX = pe / BASE.pe

  const applyScript = (s) => {
    setEps(s.eps)
    setPe(s.pe)
    setActive(s.id)
  }

  return (
    <div className="case-page concept-page">
      <header>
        <Link to="/" className="back-link">
          ← 首頁
        </Link>
        <h1>股價為什麼會漲</h1>
        <p className="case-subtitle">
          任何股價都只有兩個零件：賺多少（EPS）× 市場願意付幾倍（本益比）。所有的新聞、題材、恐慌與狂熱，最終都得透過這兩個零件起作用。
        </p>
      </header>

      <div className="calc-box concept-lab">
        <div className="calc-sliders">
          <label>
            <span className="calc-label">
              EPS（每股獲利）<strong>{eps} 元</strong>
            </span>
            <input type="range" min="2" max="30" step="1" value={eps} onChange={(e) => { setEps(Number(e.target.value)); setActive(null) }} />
          </label>
          <label>
            <span className="calc-label">
              本益比（願付倍數）<strong>{pe} 倍</strong>
            </span>
            <input type="range" min="5" max="50" step="1" value={pe} onChange={(e) => { setPe(Number(e.target.value)); setActive(null) }} />
          </label>
        </div>
        <div className="calc-result">
          <div className="calc-implied">{price.toLocaleString()} 元</div>
          <div className="calc-note">
            相對基準（EPS 10 × 15 倍 = 150 元）：×{totalX.toFixed(2)}
          </div>
          <div className="calc-note">
            = 獲利 ×{epsX.toFixed(2)} × 倍數 ×{peX.toFixed(2)}
          </div>
        </div>
      </div>

      <section className="anatomy-section">
        <h2>四種上漲劇本</h2>
        <p className="anatomy-intro">點一個劇本，上面的拉桿會擺出它的樣子。同樣是「漲」，零件的動法完全不同——看懂零件，才知道自己買的是哪一種。</p>
        <div className="script-grid">
          {SCRIPTS.map((s) => (
            <motion.button
              key={s.id}
              className={`script-card${active === s.id ? ' active' : ''}`}
              onClick={() => applyScript(s)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="script-head">
                <h3>{s.name}</h3>
                <span className="script-move">{s.move}</span>
              </div>
              <p>{s.desc}</p>
              <Link to={s.example.to} className="sankey-link" onClick={(e) => e.stopPropagation()}>
                {s.example.label} →
              </Link>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="anatomy-section">
        <h2>那散戶和外資呢？誰買誰賣不重要嗎？</h2>
        <p className="anatomy-intro">
          非常重要——這是最常見也最好的質疑，值得講清楚。
        </p>
        <div className="anatomy-grid">
          <div className="anatomy-card">
            <h3>直接推動股價的，確實是買賣</h3>
            <p>
              外資買超、散戶融資、ETF 申購——每一筆成交都是買方跟賣方的角力，股價分分秒秒由「誰的錢比較急」決定。這個框架完全沒有否認這件事。
            </p>
          </div>
          <div className="anatomy-card">
            <h3>但這些力量全部記在「本益比」那一項</h3>
            <p>
              股價 = EPS × 本益比是<strong>恆等式</strong>（本益比的定義就是股價 ÷ EPS），所以它不可能漏掉任何因素——它做的是<strong>分類</strong>。外資今天狂買，公司的 EPS 並不會因此改變，所以那根紅 K 造成的漲幅，在數學上全部落在本益比。本益比不是「一個原因」，它是「除了公司賺錢能力以外，其他一切力量的總容器」：資金流、槓桿、恐懼與貪婪，全裝在裡面。
            </p>
          </div>
          <div className="anatomy-card">
            <h3>時間尺度決定誰主導</h3>
            <p>
              葛拉漢的名言：市場短期是投票機（誰的錢多誰贏——籌碼與情緒，倍數項），長期是體重計（公司賺多少錢——EPS 項）。當沖客活在投票機裡，指數投資人賭的是體重計。台股外資持有市值約四成，短線確實大半看外資臉色——但外資進出的「依據」，最終也還是對未來 EPS 與合理倍數的判斷。
            </p>
          </div>
        </div>
      </section>

      <div className="insight-box takeaway">
        <h3>帶走的觀念</h3>
        <p>
          下次看到任何一檔股票大漲，先問：是 E 動了、P/E 動了，還是兩個一起動？E 的上漲需要公司做對事，P/E 的上漲只需要市場改變心情——而推動心情的，正是散戶、外資、ETF 那些真金白銀的買賣。心情會變回來，體重不會說謊。泡沫博物館裡的七場災難，全部是 P/E 極端擴張的故事。
        </p>
      </div>

      <div className="bubble-nav">
        <Link to="/market">看現在的市場位置：市場溫度計 →</Link>
        <Link to="/bubble/tulip">P/E 擴張的極端案例：泡沫博物館 →</Link>
      </div>
    </div>
  )
}
