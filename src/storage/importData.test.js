import { describe, it, expect } from 'vitest'
import { simulations } from '../simulations/registry'
import { buildExport } from './exportData'
import { parseImport } from './importData'

const entry = (worldId, values, extra = {}) => ({
  id: 'id-1',
  name: 'Test',
  worldId,
  values,
  savedAt: '2026-10-12T10:00:00.000Z',
  ...extra,
})
const file = (items) => JSON.stringify(buildExport(items))
const city = simulations.city

describe('parseImport file checks', () => {
  it('rejects text that is not JSON', () => {
    expect(parseImport('{nope').error).toBeTruthy()
  })

  it('rejects JSON from another app', () => {
    const text = JSON.stringify({ app: 'Other', version: 1, experiments: [] })
    expect(parseImport(text).error).toBeTruthy()
  })

  it('rejects an unknown version', () => {
    const text = JSON.stringify({ app: 'Alterra', version: 2, experiments: [] })
    expect(parseImport(text).error).toBeTruthy()
  })

  it('rejects a file with no experiments list', () => {
    const text = JSON.stringify({ app: 'Alterra', version: 1 })
    expect(parseImport(text).error).toBeTruthy()
  })

  it('rejects files with too many experiments', () => {
    const items = Array.from({ length: 201 }, () => entry('city', city.defaults))
    expect(parseImport(file(items)).error).toBeTruthy()
  })
})

describe.each(Object.keys(simulations))('%s world import', (worldId) => {
  const sim = simulations[worldId]
  const first = sim.variables[0]

  it('accepts its defaults unchanged', () => {
    const result = parseImport(file([entry(worldId, sim.defaults)]))
    expect(result.skipped).toBe(0)
    expect(result.experiments[0].values).toEqual(sim.defaults)
  })

  it('skips a value above the maximum', () => {
    const values = { ...sim.defaults, [first.id]: first.max + 1 }
    const result = parseImport(file([entry(worldId, values)]))
    expect(result.experiments).toHaveLength(0)
    expect(result.skipped).toBe(1)
  })

  it('skips a value below the minimum', () => {
    const values = { ...sim.defaults, [first.id]: first.min - 1 }
    expect(parseImport(file([entry(worldId, values)])).skipped).toBe(1)
  })

  it('skips numbers stored as strings', () => {
    const values = { ...sim.defaults, [first.id]: String(sim.defaults[first.id]) }
    expect(parseImport(file([entry(worldId, values)])).skipped).toBe(1)
  })

  it('skips an entry with a missing variable', () => {
    const values = { ...sim.defaults }
    delete values[first.id]
    expect(parseImport(file([entry(worldId, values)])).skipped).toBe(1)
  })
})

describe('parseImport entry cleaning', () => {
  it('skips unknown and dangerous world names', () => {
    const items = ['mars', '__proto__', 'constructor', 5].map((w) =>
      entry(w, city.defaults)
    )
    const result = parseImport(file(items))
    expect(result.experiments).toHaveLength(0)
    expect(result.skipped).toBe(4)
  })

  it('drops extra keys from values', () => {
    const values = { ...city.defaults, hack: 1 }
    const result = parseImport(file([entry('city', values)]))
    expect(result.experiments[0].values).toEqual(city.defaults)
  })

  it('snaps off-step values to the slider step', () => {
    const values = { ...city.defaults, carUse: 32 }
    const result = parseImport(file([entry('city', values)]))
    expect(result.experiments[0].values.carUse).toBe(30)
  })

  it('trims long names and falls back when empty', () => {
    const long = parseImport(file([entry('city', city.defaults, { name: 'x'.repeat(100) })]))
    expect(long.experiments[0].name).toHaveLength(60)
    const empty = parseImport(file([entry('city', city.defaults, { name: '   ' })]))
    expect(empty.experiments[0].name).toBe('Imported experiment')
  })

  it('nulls out a bad id and a bad date', () => {
    const result = parseImport(
      file([entry('city', city.defaults, { id: 42, savedAt: 'yesterday-ish' })])
    )
    expect(result.experiments[0].id).toBeNull()
    expect(result.experiments[0].savedAt).toBeNull()
  })

  it('counts skipped entries next to good ones', () => {
    const items = [entry('city', city.defaults), entry('mars', {}), null]
    const result = parseImport(file(items))
    expect(result.experiments).toHaveLength(1)
    expect(result.skipped).toBe(2)
  })
})