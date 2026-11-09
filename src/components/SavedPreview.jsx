import { simulations } from '../simulations/registry'
import './SavedPreview.css'

export default function SavedPreview({ worldId, values }) {
  if (!Object.hasOwn(simulations, worldId)) return null
  const { metrics } = simulations[worldId].simulate(values)

  return (
    <ul className="preview" aria-label="Results for this experiment">
      {metrics.map((m) => (
        <li key={m.id} className={`preview-chip preview-${m.status}`}>
          <span className="preview-dot" aria-hidden="true" />
          <span className="preview-label">{m.label}</span>
          <span className="preview-value">
            {m.value} {m.unit}
          </span>
          <span className="preview-status">{m.statusLabel}</span>
        </li>
      ))}
    </ul>
  )
}