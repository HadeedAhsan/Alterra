import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadExperiments,
  saveExperiment,
  renameExperiment,
  deleteExperiment,
  importExperiments,
} from './experiments'

const store = {}
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v) },
  removeItem: (k) => { delete store[k] },
}

const sample = { name: 'Less cars', worldId: 'city', values: { carUse: 30 } }
const incoming = {
  id: 'x1',
  name: 'Imported',
  worldId: 'city',
  values: { carUse: 30 },
  savedAt: '2026-10-12T10:00:00.000Z',
}
describe('experiment storage', () => {
  beforeEach(() => {
    for (const k of Object.keys(store)) delete store[k]
  })

  it('starts empty', () => {
    expect(loadExperiments()).toEqual([])
  })

  it('saves and loads an experiment', () => {
    const saved = saveExperiment(sample)
    const list = loadExperiments()
    expect(list).toHaveLength(1)
    expect(list[0].id).toBe(saved.id)
    expect(list[0].values).toEqual({ carUse: 30 })
  })

  it('renames an experiment', () => {
    const saved = saveExperiment(sample)
    renameExperiment(saved.id, 'Greener city')
    expect(loadExperiments()[0].name).toBe('Greener city')
  })

  it('deletes an experiment', () => {
    const saved = saveExperiment(sample)
    deleteExperiment(saved.id)
    expect(loadExperiments()).toEqual([])
  })

  it('survives corrupted data', () => {
    store['alterra:experiments'] = '{not json'
    expect(loadExperiments()).toEqual([])
  })

  it('falls back to a default name', () => {
    expect(saveExperiment({ ...sample, name: '   ' }).name).toBe('Untitled experiment')
  })
  it('imports experiments and keeps their ids', () => {
    expect(importExperiments([incoming])).toEqual({ ok: true, added: 1, duplicates: 0 })
    expect(loadExperiments()[0].id).toBe('x1')
  })

  it('skips ids that already exist', () => {
    importExperiments([incoming])
    expect(importExperiments([incoming])).toEqual({ ok: true, added: 0, duplicates: 1 })
    expect(loadExperiments()).toHaveLength(1)
  })

  it('creates an id and a date when they are missing', () => {
    importExperiments([{ ...incoming, id: null, savedAt: null }])
    const [saved] = loadExperiments()
    expect(typeof saved.id).toBe('string')
    expect(Number.isNaN(Date.parse(saved.savedAt))).toBe(false)
  })
})