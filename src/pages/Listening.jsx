import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// 三層過濾器的顏色
const KIND = {
  fact: { label: '事實', color: '#5598e7', bg: 'rgba(57, 135, 229, 0.15)' },
  frame: { label: '框架', color: '#1baf7a', bg: 'rgba(25, 158, 112, 0.15)' },
  forecast: { label: '預測', color: '#eda100', bg: 'rgba(201, 133, 0, 0.18)' },
}

// EP677（2026-07-08）拆解範例——內容為本站改寫摘要，非逐字引用
const EXAMPLE = [
  {
    kind: 'fact',
    said: '新一代散戶用信貸疊融資、期貨滾倉，槓桿常見 5–6 倍以上，一兩根跌停就畢業。',
    action: '可查證的觀察——和溫度計的「融資餘額 11 個月 +164% 創新高」互相印證。兩個獨立來源指向同一件事時，訊號可信度上升。',
    link: { to: '/market', label: '對照市場溫度計' },
  },
  {
    kind: 'fact',
    said: 'SemiAnalysis 報告指出 800VDC 與部分新架構時程遞延。',
    action: '報告存在、內容可查——這是事實。但「遞延代表什麼」就是下一層的判斷了，兩者要分開。',
    link: { to: '/industry/semiconductor', label: '打開半導體供應鏈看誰受影響' },
  },
  {
    kind: 'forecast',
    said: '遞延只是短期壓力測試，長線趨勢不變。',
    action: '這是判斷，不是事實。正確用法：翻譯成假設丟進計算機——「長線不變」= 獲利成長如期兌現，拉拉看那個情境值多少點，再決定你信多少。',
    link: { to: '/market', label: '把它變成計算機的假設' },
  },
  {
    kind: 'frame',
    said: '進場前先想下檔風險，不要只看上檔空間。',
    action: '可重複使用的思考工具——這種內容十年後還是對的，是聽節目真正該帶走的東西。收下。',
    link: null,
  },
]

const RESOURCES = [
  { label: '閱讀股癌（Threads）：每集逐字稿整理', url: 'https://www.threads.com/@read_gooaye' },
  { label: '社工日常：股癌各集筆記', url: 'https://socialworkerdaily.com/index/invest/notes-of-gooaye/' },
  { label: 'Vocus 股癌標籤：多位作者的集數整理', url: 'https://vocus.cc/tags/%E8%82%A1%E7%99%8C' },
  { label: 'AI 智慧產業地圖：股癌題材追蹤', url: 'https://aistockmap.com/influencer/Gooaye/' },
]

export default function Listening() {
  return (
    <div className="case-page listening-page">
      <header>
        <Link to="/" className="back-link">
          ← 首頁
        </Link>
        <h1>投資節目怎麼聽</h1>
        <p className="case-subtitle">
          股癌這類節目資訊密度很高，但談話內容天生混著三種東西——聽的功夫不在「聽到什麼」，在「把聽到的分類」。
        </p>
      </header>

      <section className="anatomy-section">
        <h2>三層過濾器</h2>
        <div className="anatomy-grid filter-grid">
          <div className="anatomy-card">
            <h3 style={{ color: KIND.fact.color }}>事實：可查證的</h3>
            <p>
              「某報告說了什麼」「融資餘額多少」「某公司毛利率幾 %」——這種內容可以查、可以驗，是節目最有價值的原料。聽到後的動作是：<strong>查證，然後跟其他來源交叉比對</strong>。
            </p>
          </div>
          <div className="anatomy-card">
            <h3 style={{ color: KIND.frame.color }}>框架：可重複使用的</h3>
            <p>
              「先想下檔再想上檔」「看毛利額不要只看毛利率」——不隨行情過期的思考工具。這是聽節目真正該累積的資產，<strong>十年後還是對的</strong>。
            </p>
          </div>
          <div className="anatomy-card">
            <h3 style={{ color: KIND.forecast.color }}>預測：當假設、不當答案</h3>
            <p>
              「長線趨勢不變」「這波會漲到年底」——再厲害的人，預測也只是機率。正確用法不是照抄，是<strong>翻譯成假設丟進情境計算機</strong>：如果他對，值多少點？如果他錯，我賠多少？
            </p>
          </div>
        </div>
      </section>

      <section className="anatomy-section">
        <h2>實際拆一集：股癌 EP677（2026/7/8）</h2>
        <p className="anatomy-intro">以下為本站改寫的摘要（非逐字引用），示範同一集節目裡三種內容怎麼分、分完怎麼用。</p>
        <div className="filter-rows">
          {EXAMPLE.map((e, i) => {
            const k = KIND[e.kind]
            return (
              <motion.div
                key={i}
                className="filter-row"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="filter-tag" style={{ color: k.color, background: k.bg }}>
                  {k.label}
                </span>
                <div>
                  <p className="filter-said">「{e.said}」</p>
                  <p className="filter-action">
                    {e.action}
                    {e.link && (
                      <>
                        {' '}
                        <Link to={e.link.to} className="sankey-link">
                          {e.link.label} →
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <div className="insight-box">
        <h3>一個要記得的迴圈</h3>
        <p>
          越紅的節目，越是「新聞與股價互相追逐」那個反身性迴圈的一部分——幾十萬人同時聽到同一個觀點，觀點本身就會動到價格。主持人自己也反覆強調不要抄作業，這句話值得當真：<strong>抄結論的人承接風險，學方法的人累積能力</strong>。這個網站的每一頁，都是在幫你做後者。
        </p>
      </div>

      <div className="insight-box takeaway">
        <h3>帶走的觀念</h3>
        <p>
          聽完一集節目，問自己三個問題：我查證了哪個事實？我收藏了哪個框架？我把哪個預測變成了計算機裡的假設？三題都答得出來，這集就沒白聽——答不出來，你只是聽了一段很好聽的行情故事。
        </p>
      </div>

      <div className="sources">
        <h3>追蹤資源（筆記與逐字稿）</h3>
        <ul>
          {RESOURCES.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="bubble-nav">
        <Link to="/concept">複習：股價為什麼會漲 →</Link>
        <Link to="/market">把預測變假設：市場溫度計 →</Link>
      </div>
    </div>
  )
}
