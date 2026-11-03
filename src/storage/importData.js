import { simulations } from '../simulations/registry'

export const IMPORT_MAX_BYTES = 1_000_000
const MAX_ITEMS = 200
const MAX_NAME = 60

// Keeps only the lab's own variables. Rejects the whole entry if any is
// missing, not a number, or outside the slider range. Off-step values snap to the step.
function cleanValues(worldId, raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const values = {}
  for (const v of simulations[worldId].variables) {
    const n = raw[v.id]
    if (typeof n !== 'number' || !Number.isFinite(n) || n < v.min || n > v.max) {
      return null
    }
    const step = v.step > 0 ? v.step : 1
    const snapped = v.min + Math.round((n - v.min) / step) * step
    values[v.id] = Math.min(Number(snapped.toFixed(6)), v.max)
  }
  return values
}

function cleanItem(item) {
  if (!item || typeof item !== 'object') return null
  if (typeof item.worldId !== 'string' || !Object.hasOwn(simulations, item.worldId)) {
    return null
  }
  const values = cleanValues(item.worldId, item.values)
  if (!values) return null

  const name = typeof item.name === 'string' ? item.name.trim().slice(0, MAX_NAME) : ''
  const hasId = typeof item.id === 'string' && item.id.length > 0 && item.id.length <= 100
  const hasDate = typeof item.savedAt === 'string' && !Number.isNaN(Date.parse(item.savedAt))

  return {
    id: hasId ? item.id : null,
    name: name || 'Imported experiment',
    worldId: item.worldId,
    values,
    savedAt: hasDate ? item.savedAt : null,
  }
}

// Returns { error } for a bad file, or { experiments, skipped }.
export function parseImport(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { error: 'That file is not valid JSON.' }
  }
  if (!data || typeof data !== 'object' || data.app !== 'Alterra') {
    return { error: 'That file is not an Alterra export.' }
  }
  if (data.version !== 1) {
    return { error: 'This export comes from a version of Alterra this app cannot read.' }
  }
  if (!Array.isArray(data.experiments)) {
    return { error: 'The file has no experiments list.' }
  }
  if (data.experiments.length > MAX_ITEMS) {
    return { error: `Too many experiments. The limit is ${MAX_ITEMS} per file.` }
  }

  const experiments = []
  let skipped = 0
  for (const item of data.experiments) {
    const clean = cleanItem(item)
    if (clean) experiments.push(clean)
    else skipped += 1
  }
  return { experiments, skipped }
}