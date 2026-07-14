import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'

// 供應鏈的邊：底線 + 沿路徑流動的圓點（代表物流/服務的供應方向）
export default function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
}) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <>
      <BaseEdge id={id} path={path} style={{ stroke: 'var(--hairline)', strokeWidth: 2 }} />
      <circle r="5" fill="var(--money)">
        <animateMotion dur="2.8s" repeatCount="indefinite" path={path} />
      </circle>
      {label && (
        <EdgeLabelRenderer>
          <div
            className="edge-label"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
