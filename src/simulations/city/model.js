export const cityVariables = [
  { id: 'population', label: 'Population', min: 50, max: 500, step: 10, unit: 'thousand', default: 200 },
  { id: 'carUse', label: 'Car use', min: 10, max: 90, step: 5, unit: '%', default: 60 },
  { id: 'transitFrequency', label: 'Transit frequency', min: 0.5, max: 10, step: 0.5, unit: 'trips/hr', default: 2.5 },
]

export const cityDefaults = Object.fromEntries(
  cityVariables.map((v) => [v.id, v.default])
)

// Thousand cars the roads can carry comfortably.
const ROAD_CAPACITY = 150

const clamp = (n, low, high) => Math.min(Math.max(n, low), high)

const variableById = Object.fromEntries(cityVariables.map((v) => [v.id, v]))

// Falls back to the default for NaN or missing values, then keeps the value in range.
function cleanInput(id, value) {
  const v = variableById[id]
  const n = Number.isFinite(value) ? value : v.default
  return clamp(n, v.min, v.max)
}

function congestionStatus(value) {
  if (value >= 80) return { status: 'error', statusLabel: 'Heavy' }
  if (value >= 50) return { status: 'caution', statusLabel: 'Busy' }
  return { status: 'success', statusLabel: 'Light' }
}

function commuteStatus(value) {
  if (value >= 40) return { status: 'error', statusLabel: 'Long' }
  if (value >= 25) return { status: 'caution', statusLabel: 'Moderate' }
  return { status: 'success', statusLabel: 'Quick' }
}

function ridershipStatus(value) {
  if (value >= 30) return { status: 'success', statusLabel: 'Healthy' }
  if (value >= 15) return { status: 'caution', statusLabel: 'Fair' }
  return { status: 'error', statusLabel: 'Low' }
}

function summarize(congestion, ridership) {
  const roads =
    congestion >= 80 ? 'Roads are jammed'
    : congestion >= 50 ? 'Roads are busy'
    : 'Roads are flowing'
  const transit =
    ridership >= 30 ? 'transit is carrying a large share of riders.'
    : ridership >= 15 ? 'transit carries a fair share.'
    : 'few people use transit.'
  return `${roads}, and ${transit}`
}

export function simulateCity(input) {
  const population = cleanInput('population', input?.population)
  const carUse = cleanInput('carUse', input?.carUse)
  const transitFrequency = cleanInput('transitFrequency', input?.transitFrequency)

  const carShare = carUse / 100
  const transitShare = (1 - carShare) * (transitFrequency / (transitFrequency + 1.5))

  const cars = population * carShare
  const load = cars / ROAD_CAPACITY

  const congestion = Math.round(Math.min(load, 1) * 100)
  const commute = Math.round(15 + 20 * Math.min(load, 1.5) ** 2)
  const ridership = Math.round(transitShare * 100)

  return {
    metrics: [
      { id: 'commute', label: 'Average commute', value: commute, unit: 'min', ...commuteStatus(commute) },
      { id: 'congestion', label: 'Road congestion', value: congestion, unit: '%', ...congestionStatus(congestion) },
      { id: 'ridership', label: 'Transit ridership', value: ridership, unit: '%', ...ridershipStatus(ridership) },
    ],
    summary: summarize(congestion, ridership),
    assumptions:
      'Simplified illustrative model. Roads carry 150 thousand cars comfortably, and transit use depends only on frequency and how many people avoid driving. It is not a prediction for any real city.',
  }
}