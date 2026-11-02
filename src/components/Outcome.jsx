import './Outcome.css'

export default function Outcome({ metrics, summary, assumptions }) {
  return (
    <div className="outcome">
      <dl className="outcome-metrics">
        {metrics.map(({ id, label, value, unit, status, statusLabel }) => (
          <div key={id} className="metric">
            <dt className="metric-label">{label}</dt>
            <dd className="metric-row">
              <span className="metric-value">{value}</span>
              <span className="metric-unit">{unit}</span>
              {status && (
                <span className={`metric-status status-${status}`}>
                  {statusLabel}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <p className="outcome-summary" aria-live="polite">{summary}</p>

      <details className="outcome-assumptions">
        <summary>Assumptions and limits</summary>
        <p>{assumptions}</p>
      </details>
    </div>
  )
}