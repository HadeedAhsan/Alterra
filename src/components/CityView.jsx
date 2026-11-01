import './CityView.css'

const LEFT = 50
const WIDTH = 700

const STATUS_COLOR = {
  success: 'var(--success)',
  caution: 'var(--caution)',
  error: 'var(--error)',
}

function spread(count, i) {
  return LEFT + (i + 0.5) * (WIDTH / count)
}

export default function CityView({ values, result, baselineValues }) {
  const congestion = result.metrics.find((m) => m.id === 'congestion')

  const buildingCount = Math.round(values.population / 10)
  const carCount = Math.round((values.population * values.carUse) / 1000)
  const busCount = Math.round(values.transitFrequency)
  const ghostCarCount = baselineValues
  ? Math.round((baselineValues.population * baselineValues.carUse) / 1000)
  : 0
const ghostBusCount = baselineValues
  ? Math.round(baselineValues.transitFrequency)
  : 0

  const buildingWidth = Math.min(14, (WIDTH / buildingCount) * 0.7)

  const label = `City view: ${carCount} cars on the road, ${busCount} buses on the transit line, road is ${congestion.statusLabel.toLowerCase()}.${
  baselineValues
    ? ` Baseline had ${ghostCarCount} cars and ${ghostBusCount} buses.`
    : ''
}`
  return (
    <figure className="city-view">
      <svg viewBox="0 0 800 300" role="img" aria-label={label}>
        {Array.from({ length: ghostCarCount }, (_, i) => (
  <rect
    key={`ghost-car-${i}`}
    className="city-ghost"
    x={spread(ghostCarCount, i) - 6}
    y="166"
    width="12"
    height="8"
    rx="2"
  />
))}

{Array.from({ length: ghostBusCount }, (_, i) => (
  <circle
    key={`ghost-bus-${i}`}
    className="city-ghost"
    cx={spread(ghostBusCount, i)}
    cy="250"
    r="8"
  />
))}
        {Array.from({ length: buildingCount }, (_, i) => {
          const height = 24 + ((i * 7) % 5) * 10
          return (
            <rect
              key={i}
              className="city-building"
              x={spread(buildingCount, i) - buildingWidth / 2}
              y={110 - height}
              width={buildingWidth}
              height={height}
              rx="2"
            />
          )
        })}

        <rect
          className="city-road"
          x={LEFT - 10}
          y="155"
          width={WIDTH + 20}
          height="30"
          rx="8"
          style={{ stroke: STATUS_COLOR[congestion.status] }}
        />

        {Array.from({ length: carCount }, (_, i) => (
          <rect
            key={i}
            className="city-car"
            x={spread(carCount, i) - 6}
            y="166"
            width="12"
            height="8"
            rx="2"
          />
        ))}

        <line className="city-transit-line" x1={LEFT} y1="250" x2={LEFT + WIDTH} y2="250" />

        {Array.from({ length: busCount }, (_, i) => (
          <circle
            key={i}
            className="city-bus"
            cx={spread(busCount, i)}
            cy="250"
            r="8"
          />
        ))}
      </svg>
      <figcaption className="city-caption">
  Top: population. Middle: roads. Bottom: transit.
  {baselineValues && ' Dashed violet outlines show your baseline.'}
</figcaption>
    </figure>
  )
}