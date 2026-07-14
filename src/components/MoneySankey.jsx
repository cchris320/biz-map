import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { sankey, sankeyLeft, sankeyLinkHorizontal } from 'd3-sankey'

const W = 960
const H = 480

// 利潤主幹排前面（會排在上方），成本費用往下岔出去
const NODE_COLOR = {
  profit: '#3987e5',
  cost: '#52514e',
  net: '#9ec5f4',
}

function buildGraph(pnl) {
  const gross = pnl.revenue - pnl.cogs
  const opInc = gross - pnl.rd - pnl.sga
  const net = opInc - pnl.taxAndOther

  const nodes = [
    { id: 'revenue', name: '營收', kind: 'profit' },
    { id: 'gross', name: '毛利', kind: 'profit' },
    { id: 'cogs', name: '營業成本', kind: 'cost' },
    { id: 'opinc', name: '營業利益', kind: 'profit' },
    { id: 'rd', name: '研發費用', kind: 'cost' },
    { id: 'sga', name: '管銷費用', kind: 'cost' },
    { id: 'net', name: '稅後淨利', kind: 'net' },
    { id: 'tax', name: '所得稅與其他', kind: 'cost' },
  ]
  const links = [
    { source: 'revenue', target: 'gross', value: gross },
    { source: 'revenue', target: 'cogs', value: pnl.cogs },
    { source: 'gross', target: 'opinc', value: opInc },
    { source: 'gross', target: 'rd', value: pnl.rd },
    { source: 'gross', target: 'sga', value: pnl.sga },
    { source: 'opinc', target: 'net', value: net },
    { source: 'opinc', target: 'tax', value: pnl.taxAndOther },
  ].filter((l) => l.value > 0) // 某些產業沒有研發費用之類的項目，值為 0 就不畫

  const used = new Set(links.flatMap((l) => [l.source, l.target]))
  return { nodes: nodes.filter((n) => used.has(n.id)), links }
}

export default function MoneySankey({ pnl, unit }) {
  const [tip, setTip] = useState(null)
  const [hoverLink, setHoverLink] = useState(null)

  const { nodes, links } = useMemo(() => {
    const graph = buildGraph(pnl)
    const layout = sankey()
      .nodeId((d) => d.id)
      .nodeWidth(14)
      .nodePadding(34)
      .nodeAlign(sankeyLeft)
      .nodeSort(null)
      .linkSort(null)
      .extent([
        [10, 16],
        [820, H - 16],
      ])
    return layout({
      nodes: graph.nodes.map((d) => ({ ...d })),
      links: graph.links.map((d) => ({ ...d })),
    })
  }, [pnl])

  const pct = (v) => `${Math.round((v / pnl.revenue) * 100)}%`
  const fmt = (v) => `${v.toLocaleString('zh-TW')} ${unit}`

  const showTip = (e, text) => {
    const box = e.currentTarget.ownerSVGElement.parentNode.getBoundingClientRect()
    setTip({ x: e.clientX - box.left, y: e.clientY - box.top, text })
  }

  return (
    <div className="sankey-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="sankey-svg" role="img" aria-label="金流桑基圖">
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {links.map((l, i) => (
            <path
              key={i}
              d={sankeyLinkHorizontal()(l)}
              fill="none"
              stroke={NODE_COLOR[l.target.kind]}
              strokeWidth={Math.max(1, l.width)}
              strokeOpacity={hoverLink === null ? 0.35 : hoverLink === i ? 0.65 : 0.15}
              style={{ transition: 'stroke-opacity 0.15s' }}
              onMouseMove={(e) =>
                showTip(e, `${l.source.name} → ${l.target.name}：${fmt(l.value)}（佔營收 ${pct(l.value)}）`)
              }
              onMouseEnter={() => setHoverLink(i)}
              onMouseLeave={() => {
                setHoverLink(null)
                setTip(null)
              }}
            />
          ))}
          {nodes.map((n) => (
            <g key={n.id}>
              <rect
                x={n.x0}
                y={n.y0}
                width={n.x1 - n.x0}
                height={Math.max(1, n.y1 - n.y0)}
                rx="3"
                fill={NODE_COLOR[n.kind]}
                onMouseMove={(e) => showTip(e, `${n.name}：${fmt(n.value)}（佔營收 ${pct(n.value)}）`)}
                onMouseLeave={() => setTip(null)}
              />
              <text
                x={n.x1 + 10}
                y={(n.y0 + n.y1) / 2 - 6}
                className="sankey-label-name"
              >
                {n.name}
              </text>
              <text x={n.x1 + 10} y={(n.y0 + n.y1) / 2 + 12} className="sankey-label-value">
                {n.value.toLocaleString('zh-TW')} 億・{pct(n.value)}
              </text>
            </g>
          ))}
        </motion.g>
      </svg>
      {tip && (
        <div className="sankey-tip" style={{ left: tip.x + 14, top: tip.y + 10 }}>
          {tip.text}
        </div>
      )}
    </div>
  )
}
