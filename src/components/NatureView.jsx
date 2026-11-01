import { simulateNature } from '../simulations/nature/model'
import './NatureView.css'

const LEFT = 50
const WIDTH = 700

const SLOTS = 28
const PLANT_BASE = 110
const PLANT_MIN = 12
const PLANT_MAX = 70
const PLANT_HALF = 8

const HERD_Y = 178
const PRED_Y = 252
const HERBIVORES_PER_DOT = 4

const STATUS_COLOR = {
  success: 'var(--success)',
  caution: 'var(--caution)',
  error: 'var(--error)',
}

const metric = (result, id) => result.metrics.find((m) => m.id === id)
const spread = (count, i) => LEFT + (i + 0.5) * (WIDTH / count)
const slotX = (i) => LEFT + (i + 0.5) * (WIDTH / SLOTS)
const plantedSlots = (cleared) => Math.round(SLOTS * (1 - cleared / 100))
const plantHeight = (vegetation) =>
  PLANT_MIN + (vegetation / 100) * (PLANT_MAX - PLANT_MIN)
const herdDots = (herbivores) => Math.round(herbivores / HERBIVORES_PER_DOT)
const treePath = (x, height) =>
  `M${x - PLANT_HALF} ${PLANT_BASE} L${x} ${PLANT_BASE - height} L${x + PLANT_HALF} ${PLANT_BASE} Z`

export default function NatureView({ values, result, baselineValues }) {
  const vegetation = metric(result, 'vegetation')
  const herbivores = metric(result, 'herbivores')
  const health = metric(result, 'health')

  const baseline = baselineValues ? simulateNature(baselineValues) : null
  const baseVegetation = baseline ? metric(baseline, 'vegetation').value : 0
  const baseHerbivores = baseline ? metric(baseline, 'herbivores').value : 0

  const planted = plantedSlots(values.cleared)
  const ghostPlanted = baseline ? plantedSlots(baselineValues.cleared) : 0
  const height = plantHeight(vegetation.value)
  const ghostHeight = plantHeight(baseVegetation)

  const herdCount = herdDots(herbivores.value)
  const ghostHerdCount = baseline ? herdDots(baseHerbivores) : 0
  const predatorCount = values.predators
  const ghostPredatorCount = baseline ? baselineValues.predators : 0

  const label = `Nature view: ${vegetation.value} percent plant cover, ${herbivores.value} herbivores per square kilometre, ${values.predators} predators per 100 square kilometres, ${values.cleared} percent of land cleared. Ecosystem health is ${health.statusLabel.toLowerCase()}.${
    baseline
      ? ` Baseline had ${baseVegetation} percent plant cover and ${baseHerbivores} herbivores.`
      : ''
  }`

  return (
    <figure className="nature-view">
      <svg viewBox="0 0 800 300" role="img" aria-label={label}>
        <text className="nature-label" x={LEFT} y="24">
          Plants · {vegetation.value}% cover
        </text>

        {Array.from({ length: ghostPlanted }, (_, i) => (
          <path
            key={`ghost-plant-${i}`}
            className="nature-ghost"
            d={treePath(slotX(i), ghostHeight)}
          />
        ))}

        <line
          className="nature-ground"
          x1={LEFT - 10}
          x2={LEFT + WIDTH + 10}
          y1={PLANT_BASE + 2}
          y2={PLANT_BASE + 2}
        />

        {Array.from({ length: planted }, (_, i) => (
          <path
            key={`plant-${i}`}
            className="nature-plant"
            d={treePath(slotX(i), height)}
            style={{ fill: STATUS_COLOR[vegetation.status] }}
          />
        ))}

        {Array.from({ length: SLOTS - planted }, (_, i) => (
          <rect
            key={`stump-${i}`}
            className="nature-stump"
            x={slotX(planted + i) - 5}
            y={PLANT_BASE - 4}
            width="10"
            height="4"
            rx="1"
          />
        ))}

        <text className="nature-label" x={LEFT} y="154">
          Herbivores · {herbivores.value} per km²
        </text>
        <rect
          className="nature-lane"
          x={LEFT - 10}
          y={HERD_Y - 16}
          width={WIDTH + 20}
          height="32"
          rx="8"
          style={{ stroke: STATUS_COLOR[herbivores.status] }}
        />

        {Array.from({ length: ghostHerdCount }, (_, i) => (
          <rect
            key={`ghost-herd-${i}`}
            className="nature-ghost"
            x={spread(ghostHerdCount, i) - 6}
            y={HERD_Y - 4}
            width="12"
            height="8"
            rx="2"
          />
        ))}

        {Array.from({ length: herdCount }, (_, i) => (
          <rect
            key={`herd-${i}`}
            className="nature-herbivore"
            x={spread(herdCount, i) - 6}
            y={HERD_Y - 4}
            width="12"
            height="8"
            rx="2"
          />
        ))}

        <text className="nature-label" x={LEFT} y="230">
          Predators · {values.predators} per 100 km²
        </text>
        <rect
          className="nature-lane"
          x={LEFT - 10}
          y={PRED_Y - 16}
          width={WIDTH + 20}
          height="32"
          rx="8"
        />

        {Array.from({ length: ghostPredatorCount }, (_, i) => (
          <circle
            key={`ghost-pred-${i}`}
            className="nature-ghost"
            cx={spread(ghostPredatorCount, i)}
            cy={PRED_Y}
            r="8"
          />
        ))}

        {Array.from({ length: predatorCount }, (_, i) => (
          <circle
            key={`pred-${i}`}
            className="nature-predator"
            cx={spread(predatorCount, i)}
            cy={PRED_Y}
            r="7"
          />
        ))}
      </svg>

      <figcaption className="nature-caption">
        Top: plants, with stumps where land is cleared. Middle: herbivores, one
        block is about {HERBIVORES_PER_DOT}. Bottom: predators.
        {baseline && ' Dashed violet outlines show your baseline.'}
      </figcaption>
    </figure>
  )
}