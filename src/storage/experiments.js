const KEY = 'alterra:experiments'

function isValid(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.worldId === 'string' &&
    item.values &&
    typeof item.values === 'object'
  )
}

export function loadExperiments() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isValid) : []
  } catch {
    return []
  }
}

function persist(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}
function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
export function saveExperiment({ name, worldId, values }) {
  const experiment = {
    id: makeId(),
    name: name.trim() || 'Untitled experiment',
    worldId,
    values,
    savedAt: new Date().toISOString(),
  }
  const ok = persist([experiment, ...loadExperiments()])
  return ok ? experiment : null
}

export function renameExperiment(id, name) {
  const list = loadExperiments().map((e) =>
    e.id === id ? { ...e, name: name.trim() || e.name } : e
  )
  return persist(list)
}

export function deleteExperiment(id) {
  return persist(loadExperiments().filter((e) => e.id !== id))
}

export function importExperiments(items) {
  const existing = loadExperiments()
  const seen = new Set(existing.map((e) => e.id))
  const fresh = []
  let duplicates = 0

  for (const item of items) {
    if (item.id && seen.has(item.id)) {
      duplicates += 1
      continue
    }
    const experiment = {
      id: item.id ?? makeId(),
      name: item.name,
      worldId: item.worldId,
      values: item.values,
      savedAt: item.savedAt ?? new Date().toISOString(),
    }
    seen.add(experiment.id)
    fresh.push(experiment)
  }

  if (fresh.length === 0) return { ok: true, added: 0, duplicates }
  const ok = persist([...fresh, ...existing])
  return { ok, added: ok ? fresh.length : 0, duplicates }
}