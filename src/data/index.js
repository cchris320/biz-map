import semiconductor from './industries/semiconductor.json'
import ems from './industries/ems.json'
import finance from './industries/finance.json'
import shipping from './industries/shipping.json'
import retail from './industries/retail.json'
import telecom from './industries/telecom.json'
import tsmc from './companies/2330.json'
import mediatek from './companies/2454.json'
import ase from './companies/3711.json'
import foxconn from './companies/2317.json'
import quanta from './companies/2382.json'
import evergreen from './companies/2603.json'
import pcsc from './companies/2912.json'
import cht from './companies/2412.json'
import aseCase from './cases/3711.json'
import tulip from './bubbles/tulip.json'
import southsea from './bubbles/southsea.json'
import crash1929 from './bubbles/crash1929.json'
import taiwan1990 from './bubbles/taiwan1990.json'
import japan from './bubbles/japan.json'
import dotcom from './bubbles/dotcom.json'
import gfc from './bubbles/gfc.json'

// 新增產業時：在 industries/ 下加一個 JSON，然後 import 進來即可
export const industries = [semiconductor, ems, finance, shipping, retail, telecom]

// 新增公司金流拆解時：在 companies/ 下加一個 JSON，然後 import 進來即可
export const companies = [tsmc, mediatek, ase, foxconn, quanta, evergreen, pcsc, cht]

// 之後想做但還沒寫資料的產業，顯示成「即將推出」卡片
export const upcoming = []

export function getIndustry(id) {
  return industries.find((i) => i.id === id)
}

export function getCompany(ticker) {
  return companies.find((c) => c.ticker === ticker)
}

// 「這段漲幅從哪來」案例：在 cases/ 下加 JSON 再 import
export const cases = [aseCase]

export function getCase(ticker) {
  return cases.find((c) => c.ticker === ticker)
}

// 泡沫博物館：依年代排序，在 bubbles/ 下加 JSON 再 import
export const bubbles = [tulip, southsea, crash1929, taiwan1990, japan, dotcom, gfc]

export function getBubble(id) {
  return bubbles.find((b) => b.id === id)
}
