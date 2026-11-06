import './CityView.css'

const LEFT = 50
const WIDTH = 700

const STATUS_COLOR = {
  success: 'var(--success)',
  caution: 'var(--caution)',
  error: 'var(--error)',
}

// Seconds a car takes to cross the road. Heavier congestion means slower traffic.
const DRIVE_SECONDS = { success: 10, caution: 16, error: 26 }

// Spreads items along the road so adding one never moves the others.
const phase = (i) => (i * 0.61803398875) % 1

function spread(count, i) {
  return LEFT + (i + 0.5) * (WIDTH / count)
}

// Which windows of a building are lit. A fixed pattern, no randomness.
function litWindows(i, width, height) {
  const cols = width >= 8 ? 2 : 1
  const rows = Math.max(1, Math.floor((height - 8) / 9))
  const lit = []
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if ((i * 7 + r * 13 + c * 5) % 4 !== 0) lit.push({ r, c, cols })
    }
  }
  return lit
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
  const carSeconds = DRIVE_SECONDS[congestion.status]
  const busSeconds = carSeconds * 1.8
  const smog = (congestion.value / 100) * 0.6

  const label = `City view: ${carCount} cars on the road, ${busCount} buses on the transit line, road is ${congestion.statusLabel.toLowerCase()}.${
    baselineValues
      ? ` Baseline had ${ghostCarCount} cars and ${ghostBusCount} buses.`
      : ''
  }`

  return (
    <figure className="city-view">
      <svg viewBox="0 0 800 300" role="img" aria-label={label}>
        <defs>
          <linearGradient id="city-smog" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" className="city-smog-stop" stopOpacity="0.7" />
            <stop offset="1" className="city-smog-stop" stopOpacity="0" />
          </linearGradient>
        </defs>

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
          const x = spread(buildingCount, i) - buildingWidth / 2
          const top = 110 - height
          return (
            <g key={i}>
              <rect
                className="city-building"
                x={x}
                y={top}
                width={buildingWidth}
                height={height}
                rx="2"
              />
              {litWindows(i, buildingWidth, height).map(({ r, c, cols }) => (
                <rect
                  key={`${r}-${c}`}
                  className="city-window"
                  x={x + (buildingWidth / (cols + 1)) * (c + 1) - 1.25}
                  y={top + 6 + r * 9}
                  width="2.5"
                  height="4"
                  rx="0.5"
                />
              ))}
            </g>
          )
        })}

        <rect
          className="city-smog"
          x={LEFT - 10}
          y="30"
          width={WIDTH + 20}
          height="125"
          fill="url(#city-smog)"
          style={{ opacity: smog }}
        />

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
          <g
            key={i}
            className="city-mover"
            style={{
              transform: `translateX(${phase(i) * WIDTH}px)`,
              animationDuration: `${carSeconds}s`,
              animationDelay: `${-phase(i) * carSeconds}s`,
            }}
          >
            <rect className="city-car" x={LEFT - 6} y="166" width="12" height="8" rx="2" />
            <rect className="city-headlight" x={LEFT + 3} y="168" width="3" height="4" rx="1" />
          </g>
        ))}

        <line className="city-transit-line" x1={LEFT} y1="250" x2={LEFT + WIDTH} y2="250" />

        {Array.from({ length: busCount }, (_, i) => (
          <g
            key={i}
            className="city-mover"
            style={{
              transform: `translateX(${phase(i + 3) * WIDTH}px)`,
              animationDuration: `${busSeconds}s`,
              animationDelay: `${-phase(i + 3) * busSeconds}s`,
            }}
          >
            <circle className="city-bus" cx={LEFT} cy="250" r="8" />
          </g>
        ))}
      </svg>
      <figcaption className="city-caption">
        Top: population, with haze as roads clog. Middle: roads. Bottom: transit.
        {baselineValues && ' Dashed violet outlines show your baseline.'}
      </figcaption>
    </figure>
  )
}