export const timeVariables = [
  { id: 'sleep', label: 'Sleep', min: 4, max: 10, step: 0.5, unit: 'hrs', default: 7 },
  { id: 'work', label: 'Focused work', min: 0, max: 14, step: 0.5, unit: 'hrs', default: 6 },
  { id: 'exercise', label: 'Exercise', min: 0, max: 3, step: 0.5, unit: 'hrs', default: 0.5 },
]

export const timeDefaults = Object.fromEntries(
  timeVariables.map((v) => [v.id, v.default])
)

export const DAY_HOURS = 24
// Hours taken by meals, commute, and chores every day.
export const FIXED_HOURS = 3
// Hours left to allocate.
const FREE_HOURS = DAY_HOURS - FIXED_HOURS
// Energy lost per work hour beyond 8.
const OVERWORK_DRAIN = 10
// Energy lost per hour the day is overbooked.
const OVERBOOK_STRESS = 4

const clamp = (n, low, high) => Math.min(Math.max(n, low), high)

const variableById = Object.fromEntries(timeVariables.map((v) => [v.id, v]))

// Falls back to the default for NaN or missing values, then keeps the value in range.
function cleanInput(id, value) {
  const v = variableById[id]
  const n = Number.isFinite(value) ? value : v.default
  return clamp(n, v.min, v.max)
}

// 1 at 8 hours. Short sleep falls faster than long sleep.
function sleepScore(sleep) {
  const score = sleep < 8 ? 1 - (8 - sleep) / 6 : 1 - (sleep - 8) / 12
  return clamp(score, 0, 1)
}

function freeStatus(value) {
  if (value < 0) return { status: 'error', statusLabel: 'Overbooked' }
  if (value < 2) return { status: 'caution', statusLabel: 'Tight' }
  return { status: 'success', statusLabel: 'Balanced' }
}

function energyStatus(value) {
  if (value >= 70) return { status: 'success', statusLabel: 'High' }
  if (value >= 45) return { status: 'caution', statusLabel: 'Moderate' }
  return { status: 'error', statusLabel: 'Low' }
}

function outputStatus(value) {
  if (value >= 5) return { status: 'success', statusLabel: 'Strong' }
  if (value >= 3) return { status: 'caution', statusLabel: 'Fair' }
  return { status: 'error', statusLabel: 'Weak' }
}

function summarize(free, energy) {
  const day =
    free < 0 ? 'The day is overbooked'
    : free < 2 ? 'The day is tight'
    : 'The day has room to breathe'
  const feel =
    energy >= 70 ? 'energy stays high.'
    : energy >= 45 ? 'energy is moderate.'
    : 'energy is running low.'
  return `${day}, and ${feel}`
}

export function simulateTime(input) {
  const sleep = cleanInput('sleep', input?.sleep)
  const work = cleanInput('work', input?.work)
  const exercise = cleanInput('exercise', input?.exercise)

  const free = FREE_HOURS - sleep - work - exercise
  const overbookedHours = Math.max(0, -free)
  const overwork = Math.max(0, work - 8)

  const energy = Math.round(
    clamp(
      80 * sleepScore(sleep) +
        20 * Math.min(exercise, 1) -
        overwork * OVERWORK_DRAIN -
        overbookedHours * OVERBOOK_STRESS,
      0,
      100
    )
  )

  const effectiveWork = Math.min(work, 8) + overwork * 0.5
  const output = Math.round(effectiveWork * (0.4 + 0.6 * (energy / 100)) * 10) / 10

  return {
    overbooked: free < 0,
    metrics: [
      { id: 'free', label: 'Free time', value: free, unit: 'hrs', ...freeStatus(free) },
      { id: 'energy', label: 'Energy', value: energy, unit: 'of 100', ...energyStatus(energy) },
      { id: 'output', label: 'Productive output', value: output, unit: 'focus hrs', ...outputStatus(output) },
    ],
    summary: summarize(free, energy),
    assumptions:
      'Simplified illustrative model. It assumes 3 fixed hours a day for meals, commute, and chores, that energy peaks near 8 hours of sleep, that short sleep hurts more than long sleep, and that work past 8 hours is half as effective and drains energy. Real people vary a lot.',
  }
}