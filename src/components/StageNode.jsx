import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { marginColor } from '../lib/colors'

const TIER_LABEL = {
  上游: { bg: 'rgba(57, 135, 229, 0.15)', color: '#5598e7' },
  中游: { bg: 'rgba(25, 158, 112, 0.15)', color: '#1baf7a' },
  下游: { bg: 'rgba(201, 133, 0, 0.18)', color: '#eda100' },
  支援: { bg: 'rgba(137, 135, 129, 0.15)', color: '#898781' },
}

const handleStyle = { opacity: 0, width: 8, height: 8 }

function StageNode({ data, selected }) {
  const tier = TIER_LABEL[data.tier] ?? TIER_LABEL['支援']
  return (
    <div className={`stage-node${selected ? ' selected' : ''}`}>
      <Handle type="target" position={Position.Left} id="l" style={handleStyle} />
      <Handle type="target" position={Position.Top} id="t" style={{ ...handleStyle, left: '35%' }} />
      <Handle type="target" position={Position.Top} id="t2" style={{ ...handleStyle, left: '65%' }} />
      <Handle type="source" position={Position.Right} id="r" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="b" style={handleStyle} />

      <div className="stage-node-head">
        <span className="tier-badge" style={{ background: tier.bg, color: tier.color }}>
          {data.tier}
        </span>
        <span className="stage-name">{data.name}</span>
        {data.shift && <span className="shift-badge">↗ {data.shift.label}</span>}
      </div>
      <div className="stage-role">{data.role}</div>
      <ul className="stage-companies">
        {data.companies.map((c) => (
          <li key={c.ticker}>
            <span
              className="margin-dot"
              style={{ background: marginColor(c.grossMargin, data.metricMax) }}
            />
            <span className="company-name">{c.name}</span>
            <span className="company-margin">{c.grossMargin}%</span>
          </li>
        ))}
      </ul>
      <div className="stage-more">點擊看這一環怎麼賺錢 →</div>
    </div>
  )
}

export default memo(StageNode)
