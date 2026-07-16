// 資料一致性驗證：npm run validate
//
// 守護兩件事：
// 1. P&L 一致性保證 —— 每家公司只存 5 個原始輸入（revenue/cogs/rd/sga/taxAndOther），
//    頁面上所有數字（毛利、營業利益、淨利、各百分比）都由它們推導。
//    這裡鏡射 MoneySankey 的推導鏈，確保推導值全部非負（負值會弄壞 sankey，
//    也代表原始輸入抄錯了）。
// 2. 參照完整性 —— edges 指到存在的 stage、shift.case 指到存在的 case、
//    company.industry 指到存在的 industry、id/ticker 不重複。
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data')
const load = (p) => JSON.parse(readFileSync(p, 'utf-8'))
const dir = (name) => readdirSync(join(DATA, name)).filter((f) => f.endsWith('.json'))
  .map((f) => ({ file: `${name}/${f}`, data: load(join(DATA, name, f)) }))

const errors = []
const err = (file, msg) => errors.push(`${file}: ${msg}`)

const industries = dir('industries')
const companies = dir('companies')
const cases = dir('cases')
const bubbles = dir('bubbles')

// ---------- 公司 P&L ----------
const PNL_KEYS = ['revenue', 'cogs', 'rd', 'sga', 'taxAndOther']
const industryIds = new Set(industries.map((i) => i.data.id))
const seenTickers = new Set()

for (const { file, data } of companies) {
  for (const k of ['ticker', 'name', 'industry', 'year', 'unit', 'pnl']) {
    if (!(k in data)) err(file, `缺少欄位 ${k}`)
  }
  if (seenTickers.has(data.ticker)) err(file, `ticker 重複：${data.ticker}`)
  seenTickers.add(data.ticker)
  if (data.industry && !industryIds.has(data.industry)) {
    err(file, `industry「${data.industry}」不存在`)
  }
  const pnl = data.pnl ?? {}
  const extra = Object.keys(pnl).filter((k) => !PNL_KEYS.includes(k))
  if (extra.length) err(file, `pnl 只能有 5 個原始輸入，多出：${extra.join(', ')}（衍生值一律用算的，不落地）`)
  for (const k of PNL_KEYS) {
    if (typeof pnl[k] !== 'number' || Number.isNaN(pnl[k])) err(file, `pnl.${k} 不是數字`)
    else if (pnl[k] < 0) err(file, `pnl.${k} 為負（${pnl[k]}）`)
  }
  if (PNL_KEYS.every((k) => typeof pnl[k] === 'number')) {
    // 鏡射 src/components/MoneySankey.jsx 的推導鏈
    const gross = pnl.revenue - pnl.cogs
    const opInc = gross - pnl.rd - pnl.sga
    const net = opInc - pnl.taxAndOther
    if (gross < 0) err(file, `毛利為負（${gross}）——sankey 無法呈現，檢查 revenue/cogs`)
    if (opInc < 0) err(file, `營業利益為負（${opInc}）`)
    if (net < 0) err(file, `稅後淨利為負（${net}）`)
  }
}

// ---------- 產業圖 ----------
const caseTickers = new Set(cases.map((c) => c.data.ticker))

for (const { file, data } of industries) {
  const stageIds = new Set()
  for (const s of data.stages ?? []) {
    if (stageIds.has(s.id)) err(file, `stage id 重複：${s.id}`)
    stageIds.add(s.id)
    for (const k of ['name', 'tier', 'role', 'howTheyEarn', 'marginStory', 'companies', 'pos']) {
      if (!(k in s)) err(file, `stage ${s.id} 缺少欄位 ${k}`)
    }
    for (const c of s.companies ?? []) {
      if (typeof c.grossMargin !== 'number' || c.grossMargin < 0 || c.grossMargin > 100) {
        err(file, `${s.id}/${c.ticker} grossMargin 異常：${c.grossMargin}`)
      }
      if (c.market === 'TW' && !/^\d{4}$/.test(c.ticker)) {
        err(file, `${s.id}/${c.ticker} 標為 TW 但不是 4 碼台股代號`)
      }
    }
    if (s.shift?.case && !caseTickers.has(s.shift.case)) {
      err(file, `stage ${s.id} 的 shift.case「${s.shift.case}」不存在於 cases/`)
    }
  }
  for (const e of data.edges ?? []) {
    if (!stageIds.has(e.from)) err(file, `edge from「${e.from}」不存在`)
    if (!stageIds.has(e.to)) err(file, `edge to「${e.to}」不存在`)
    if (!e.flow) err(file, `edge ${e.from}→${e.to} 缺 flow 說明`)
  }
}

// ---------- 案例 / 泡沫 / 市場 ----------
for (const { file, data } of cases) {
  for (const k of ['ticker', 'title', 'period', 'priceStart', 'priceEnd', 'events', 'takeaway', 'sources']) {
    if (!(k in data)) err(file, `缺少欄位 ${k}`)
  }
}

const bubbleIds = new Set()
for (const { file, data } of bubbles) {
  if (bubbleIds.has(data.id)) err(file, `bubble id 重複：${data.id}`)
  bubbleIds.add(data.id)
  for (const k of ['name', 'period', 'oneLiner', 'phases', 'anatomy', 'takeaway', 'dataNote', 'sources']) {
    if (!(k in data)) err(file, `缺少欄位 ${k}`)
  }
}

const market = load(join(DATA, 'market.json'))
for (const k of ['asOf', 'index', 'pe', 'indicators', 'checklist', 'sources']) {
  if (!(k in market)) err('market.json', `缺少欄位 ${k}`)
}

// ---------- 結果 ----------
const total = industries.length + companies.length + cases.length + bubbles.length + 1
if (errors.length) {
  console.error(`✗ ${errors.length} 個問題：`)
  for (const e of errors) console.error('  -', e)
  process.exit(1)
}
console.log(`✓ ${total} 個資料檔全數通過（${companies.length} 家公司 P&L 推導鏈非負、參照完整性 OK）`)
