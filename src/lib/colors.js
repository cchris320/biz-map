// 毛利率（量值）用單一藍色相的深→淺色階編碼，色階取自已驗證的參考色板
// 深色底：低毛利 = 深藍（貼近背景）、高毛利 = 淺藍（跳出來）
const RAMP = [
  '#184f95', // 600
  '#1c5cab', // 550
  '#256abf', // 500
  '#2a78d6', // 450
  '#3987e5', // 400
  '#5598e7', // 350
  '#6da7ec', // 300
  '#86b6ef', // 250
  '#9ec5f4', // 200
]

const MAX_MARGIN = 75 // 預設色階上限：NVIDIA 毛利率 73% 大約封頂

// max 可由產業自訂（例如金融業用 ROE，上限 20）
export function marginColor(value, max = MAX_MARGIN) {
  const t = Math.max(0, Math.min(1, value / max))
  return RAMP[Math.round(t * (RAMP.length - 1))]
}

export function rampGradient() {
  return `linear-gradient(90deg, ${RAMP.join(', ')})`
}
