import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadExperiments,
  saveExperiment,
  renameExperiment,
  deleteExperiment,
} from './experiments'

const store = {}
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v) },
  removeItem: (k) => { delete store[k] },
}

const sample = { name: 'Less cars', worldId: 'city', values: { carUse: 30 } }

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
})