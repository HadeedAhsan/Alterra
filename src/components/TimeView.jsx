import { DAY_HOURS, FIXED_HOURS } from '../simulations/time/model'
import './TimeView.css'

const LEFT = 50
const WIDTH = 700
// The axis runs past 24 hours so an overbooked day shows instead of being clipped.
const AXIS_HOURS = 30
const PER_HOUR = WIDTH / AXIS_HOURS

const BAR_Y = 30
const BAR_H = 56
const GHOST_Y = 130
const GHOST_H = 24
const GAUGE_Y = 194
const GAUGE_H = 16

const STATUS_COLOR = {
  success: 'var(--success)',
  caution: 'var(--caution)',
  error: 'var(--error)',
}

const xAt = (hours) => LEFT + hours * PER_HOUR

function buildSegments(values) {
  const parts = [
    { id: 'fixed', hours: FIXED_HOURS },
    { id: 'sleep', hours: values.sleep },
    { id: 'work', hours: values.work },
    { id: 'exercise', hours: values.exercise },
  ]
  let start = 0
  return parts.map((part) => {
    const segment = { ...part, start }
    start += part.hours
    return segment
  })
}

export default function TimeView({ values, result, baselineValues }) {
  const free = result.metrics.find((m) => m.id === 'free')
  const energy = result.metrics.find((m) => m.id === 'energy')
  const overbooked = free.value < 0

  const segments = buildSegments(values).filter((s) => s.hours > 0)
  const ghostSegments = baselineValues
    ? buildSegments(baselineValues).filter((s) => s.hours > 0)
    : []

  const usedHours = DAY_HOURS - free.value
  const limitX = xAt(DAY_HOURS)
  const frameTop = BAR_Y - 10
  const frameBottom = GHOST_Y + GHOST_H + 10

  const dayText = overbooked
    ? `overbooked by ${-free.value} hours`
    : `${free.value} hours free`
  const label = `Time view: ${values.sleep} hours of sleep, ${values.work} of focused work, ${values.exercise} of exercise, ${dayText}. Energy is ${energy.value} of 100, ${energy.statusLabel.toLowerCase()}.${
    baselineValues
      ? ` Baseline had ${baselineValues.sleep} sleep, ${baselineValues.work} work, ${baselineValues.exercise} exercise.`
      : ''
  }`

  const legend = [
    { id: 'fixed', label: 'Meals, commute, chores', value: FIXED_HOURS },
    { id: 'sleep', label: 'Sleep', value: values.sleep },
    { id: 'work', label: 'Focused work', value: values.work },
    { id: 'exercise', label: 'Exercise', value: values.exercise },
    {
      id: overbooked ? 'over' : 'free',
      label: overbooked ? 'Overbooked' : 'Free time',
      value: Math.abs(free.value),
    },
  ]

  return (
    <figure className="time-view">
      <svg viewBox="0 0 800 240" role="img" aria-label={label}>
                <defs>
          <pattern
            id="time-hatch"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="10" stroke="var(--error)" strokeWidth="3" />
          </pattern>
        </defs>
        <rect
          className={overbooked ? 'time-over time-over-active' : 'time-over'}
          fill="url(#time-hatch)"
          x={limitX}
          y={frameTop}
          width={LEFT + WIDTH - limitX}
          height={frameBottom - frameTop}
        />
       {segments.map((s) => (
          <rect
            key={s.id}
            className={`time-seg time-tone-${s.id}`}
            x="0"
            y={BAR_Y}
            width="1"
            height={BAR_H}
            style={{
              transform: `translateX(${xAt(s.start)}px) scaleX(${s.hours * PER_HOUR})`,
            }}
          />
        ))}

        {free.value > 0 && (
          <rect
            className="time-free time-tone-free"
            x={xAt(usedHours)}
            y={BAR_Y}
            width={free.value * PER_HOUR}
            height={BAR_H}
          />
        )}

        {[0, 6, 12, 18, 24, 30].map((h) => (
          <g key={h}>
            <line
              className="time-tick"
              x1={xAt(h)}
              x2={xAt(h)}
              y1={BAR_Y + BAR_H + 4}
              y2={BAR_Y + BAR_H + 12}
            />
            <text
              className="time-label"
              x={xAt(h)}
              y={BAR_Y + BAR_H + 28}
              textAnchor="middle"
            >
              {h}h
            </text>
          </g>
        ))}

        {ghostSegments.map((s) => (
          <rect
            key={`ghost-${s.id}`}
            className="time-ghost"
            x={xAt(s.start)}
            y={GHOST_Y}
            width={s.hours * PER_HOUR}
            height={GHOST_H}
          />
        ))}
        {!baselineValues && (
          <text className="time-label" x={LEFT} y={GHOST_Y + 16}>
            Press Compare to pin a baseline here
          </text>
        )}

        <line
          className={overbooked ? 'time-limit time-limit-over' : 'time-limit'}
          x1={limitX}
          x2={limitX}
          y1={frameTop}
          y2={frameBottom}
        />
        <text className="time-label time-label-strong" x={LEFT} y={GAUGE_Y - 8}>
          Energy {energy.value} of 100 · {energy.statusLabel}
        </text>
        <rect
          className="time-gauge-track"
          x={LEFT}
          y={GAUGE_Y}
          width={WIDTH}
          height={GAUGE_H}
          rx="8"
        />
        <rect
          className={`time-gauge-fill time-gauge-${energy.status}`}
          x={LEFT}
          y={GAUGE_Y}
          width={(energy.value / 100) * WIDTH}
          height={GAUGE_H}
          rx="8"
          style={{
            fill: STATUS_COLOR[energy.status],
            color: STATUS_COLOR[energy.status],
          }}
        />
      </svg>

      <ul className="time-legend">
        {legend.map((item) => (
          <li key={item.id}>
            <span className={`time-swatch time-tone-${item.id}`} aria-hidden="true" />
            <span>{item.label}</span>
            <span className="time-legend-value">{item.value} hrs</span>
          </li>
        ))}
      </ul>

      <figcaption className="time-caption">
        Top: your day. Past the dashed line it is overbooked. Bottom: energy.
        {baselineValues && ' Dashed violet outlines show your baseline.'}
      </figcaption>
    </figure>
  )
}