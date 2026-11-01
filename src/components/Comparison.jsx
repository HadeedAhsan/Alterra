import { compareScenarios } from '../simulations/compare'
import Button from './Button'
import './Comparison.css'

function signed(n) {
  return n > 0 ? `+${n}` : String(n)
}

export default function Comparison({ baseline, current, variables, onClear }) {
  const { changedVariables, metricChanges } = compareScenarios(
    baseline,
    current,
    variables
  )

  return (
    <div className="comparison">
      {changedVariables.length === 0 ? (
        <p className="comparison-empty">
          No changes yet. Move a slider to see how this scenario differs from
          your baseline.
        </p>
      ) : (
        <>
          <h3 className="comparison-heading">Changed variables</h3>
          <ul className="comparison-vars">
            {changedVariables.map((v) => (
              <li key={v.id}>
                <span>{v.label}</span>
                <span className="comparison-num">
                  {v.from} → {v.to} {v.unit}
                </span>
              </li>
            ))}
          </ul>

          <table className="comparison-table">
            <caption className="comparison-heading">Results</caption>
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Baseline</th>
                <th scope="col">Now</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {metricChanges.map((m) => (
                <tr key={m.id}>
                  <th scope="row">{m.label}</th>
                  <td>{m.from}</td>
                  <td>{m.to}</td>
                  <td className="comparison-delta">{signed(m.delta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <Button variant="secondary" onClick={onClear}>
        Clear baseline
      </Button>
    </div>
  )
}