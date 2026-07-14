import { useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import { AnimatePresence } from 'framer-motion'
import '@xyflow/react/dist/style.css'

import { getIndustry } from '../data'
import StageNode from '../components/StageNode'
import FlowEdge from '../components/FlowEdge'
import StageCard from '../components/StageCard'
import { rampGradient } from '../lib/colors'

const nodeTypes = { stage: StageNode }
const edgeTypes = { flow: FlowEdge }

export default function Industry() {
  const { id } = useParams()
  const industry = getIndustry(id)
  const [selectedId, setSelectedId] = useState(null)

  const metricLabel = industry?.metricLabel ?? '毛利率'
  const metricMax = industry?.metricMax ?? 75

  const nodes = useMemo(
    () =>
      (industry?.stages ?? []).map((s) => ({
        id: s.id,
        type: 'stage',
        position: s.pos,
        data: { ...s, metricMax },
      })),
    [industry, metricMax]
  )

  const edges = useMemo(
    () =>
      (industry?.edges ?? []).map((e) => ({
        id: `${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        sourceHandle: e.fromHandle,
        targetHandle: e.toHandle,
        type: 'flow',
        label: e.flow,
      })),
    [industry]
  )

  const onNodeClick = useCallback((_, node) => setSelectedId(node.id), [])

  if (!industry) {
    return (
      <div className="not-found">
        <p>找不到這個產業</p>
        <Link to="/">← 回產業列表</Link>
      </div>
    )
  }

  const selected = industry.stages.find((s) => s.id === selectedId)

  return (
    <div className="industry-page">
      <header className="industry-header">
        <div>
          <Link to="/" className="back-link">
            ← 產業列表
          </Link>
          <h1>{industry.name}供應鏈</h1>
          <p className="industry-oneliner">{industry.oneLiner}</p>
        </div>
        <div className="legend">
          <div className="legend-title">{metricLabel}（誰賺得多）</div>
          <div className="legend-ramp" style={{ background: rampGradient() }} />
          <div className="legend-ends">
            <span>低</span>
            <span>高</span>
          </div>
          <div className="legend-note">{industry.dataNote}</div>
        </div>
      </header>

      <div className="flow-wrap">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedId(null)}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.4}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#2c2c2a" gap={24} />
          <Controls showInteractive={false} />
        </ReactFlow>

        <AnimatePresence>
          {selected && (
            <StageCard
              key={selected.id}
              stage={selected}
              metricLabel={metricLabel}
              metricMax={metricMax}
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
