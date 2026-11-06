export const natureVariables = [
  { id: 'rainfall', label: 'Rainfall', min: 40, max: 160, step: 10, unit: '% of normal', default: 100 },
  { id: 'predators', label: 'Predators', min: 0, max: 20, step: 1, unit: 'per 100 km²', default: 3 },
  { id: 'cleared', label: 'Land cleared', min: 0, max: 60, step: 5, unit: '%', default: 10 },
]

export const natureDefaults = Object.fromEntries(
  natureVariables.map((v) => [v.id, v.default])
)

// Plant cover per percent of normal rainfall, before it caps at 100.
const PLANT_PER_RAIN = 0.9
// How strongly each predator holds herbivores back.
const PREDATOR_PRESSURE = 0.25
// Herbivores per km² the plants can handle before overgrazing starts.
const GRAZING_LIMIT = 50
// Healthy herbivore band, per km².
const HERD_LOW = 20
const HERD_HIGH = 50
// Most of the plant cover that overgrazing can strip away.
const MAX_GRAZING_DAMAGE = 0.6

const clamp = (n, low, high) => Math.min(Math.max(n, low), high)

const variableById = Object.fromEntries(natureVariables.map((v) => [v.id, v]))

// Falls back to the default for NaN or missing values, then keeps the value in range.
function cleanInput(id, value) {
  const v = variableById[id]
  const n = Number.isFinite(value) ? value : v.default
  return clamp(n, v.min, v.max)
}

// 100 inside the healthy band. Falls off faster above it than below it.
function herdScore(herbivores) {
  if (herbivores < HERD_LOW) return (herbivores / HERD_LOW) * 100
  if (herbivores > HERD_HIGH) return clamp(100 - (herbivores - HERD_HIGH) * 2, 0, 100)
  return 100
}

function vegetationStatus(value) {
  if (value >= 65) return { status: 'success', statusLabel: 'Lush' }
  if (value >= 40) return { status: 'caution', statusLabel: 'Thinning' }
  return { status: 'error', statusLabel: 'Barren' }
}

function herbivoreStatus(value) {
  if (value > HERD_HIGH) return { status: 'error', statusLabel: 'Overgrazing' }
  if (value < HERD_LOW) return { status: 'caution', statusLabel: 'Sparse' }
  return { status: 'success', statusLabel: 'Balanced' }
}

function healthStatus(value) {
  if (value >= 70) return { status: 'success', statusLabel: 'Thriving' }
  if (value >= 45) return { status: 'caution', statusLabel: 'Strained' }
  return { status: 'error', statusLabel: 'Collapsing' }
}

function summarize(overgrazed, vegetation, herbivores) {
  const plants =
    overgrazed ? 'Herbivores are stripping the plants'
    : vegetation >= 65 ? 'Plants are thriving'
    : vegetation >= 40 ? 'Plant cover is thinning'
    : 'Plant cover is sparse'
  const herd =
    herbivores > HERD_HIGH ? 'and the herd is too large.'
    : herbivores < HERD_LOW ? 'and the herd is small.'
    : 'and the herd is in balance.'
  return `${plants}, ${herd}`
}

export function simulateNature(input) {
  const rainfall = cleanInput('rainfall', input?.rainfall)
  const predators = cleanInput('predators', input?.predators)
  const cleared = cleanInput('cleared', input?.cleared)

  // Plant cover the land could support, before any grazing.
  const potential = clamp(rainfall * PLANT_PER_RAIN, 0, 100) * (1 - cleared / 100)

  // Herbivores follow the food supply, and predators hold them back.
  const herd = potential / (1 + PREDATOR_PRESSURE * predators)

  // Too many herbivores strip the plants.
  const overgrazing = clamp((herd - GRAZING_LIMIT) / GRAZING_LIMIT, 0, 1)
  const vegetation = potential * (1 - overgrazing * MAX_GRAZING_DAMAGE)

  const health = clamp(0.7 * vegetation + 0.3 * herdScore(herd), 0, 100)

  const vegetationValue = Math.round(vegetation)
  const herbivoreValue = Math.round(herd)
  const healthValue = Math.round(health)
  const overgrazed = herd > GRAZING_LIMIT

  return {
    overgrazed,
    potential: Math.round(potential),
    metrics: [
      { id: 'vegetation', label: 'Plant cover', value: vegetationValue, unit: '%', ...vegetationStatus(vegetationValue) },
      { id: 'herbivores', label: 'Herbivores', value: herbivoreValue, unit: 'per km²', ...herbivoreStatus(herbivoreValue) },
      { id: 'health', label: 'Ecosystem health', value: healthValue, unit: 'of 100', ...healthStatus(healthValue) },
    ],
    summary: summarize(overgrazed, vegetationValue, herbivoreValue),
    assumptions:
      'Simplified illustrative model. Plants grow with rainfall until they cap out, clearing land removes plants directly, herbivores follow the food supply, and predators hold them back. Herbivores above 50 per km² overgraze and strip the plants. Real ecosystems also have seasons, disease, migration, and many more species.',
  }
}