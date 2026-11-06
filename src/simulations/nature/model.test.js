import { describe, it, expect } from 'vitest'
import { simulateNature, natureDefaults } from './model'

const get = (result, id) => result.metrics.find((m) => m.id === id).value
const label = (result, id) => result.metrics.find((m) => m.id === id).statusLabel

describe('simulateNature', () => {
  it('gives the expected numbers for the defaults', () => {
    const result = simulateNature(natureDefaults)
    expect(get(result, 'vegetation')).toBe(81)
    expect(get(result, 'herbivores')).toBe(46)
    expect(get(result, 'health')).toBe(87)
    expect(result.overgrazed).toBe(false)
  })

  it('shows overgrazing when the predators are removed', () => {
    const none = simulateNature({ ...natureDefaults, predators: 0 })
    expect(none.overgrazed).toBe(true)
    expect(label(none, 'herbivores')).toBe('Overgrazing')
    expect(get(none, 'vegetation')).toBeLessThan(get(simulateNature(natureDefaults), 'vegetation'))
    expect(get(none, 'health')).toBeLessThan(get(simulateNature(natureDefaults), 'health'))
  })

  it('shrinks the herd as predators increase', () => {
    const few = simulateNature({ ...natureDefaults, predators: 2 })
    const many = simulateNature({ ...natureDefaults, predators: 10 })
    expect(get(many, 'herbivores')).toBeLessThan(get(few, 'herbivores'))
  })

  it('calls the herd sparse when there are too many predators', () => {
    const result = simulateNature({ ...natureDefaults, predators: 20 })
    expect(label(result, 'herbivores')).toBe('Sparse')
  })

  it('grows plants with rainfall', () => {
    const dry = simulateNature({ ...natureDefaults, rainfall: 60 })
    const normal = simulateNature({ ...natureDefaults, rainfall: 100 })
    expect(get(dry, 'vegetation')).toBeLessThan(get(normal, 'vegetation'))
  })

  it('adds nothing once rainfall passes the plant cap', () => {
    const wet = simulateNature({ ...natureDefaults, rainfall: 120 })
    const soaked = simulateNature({ ...natureDefaults, rainfall: 160 })
    expect(get(soaked, 'vegetation')).toBe(get(wet, 'vegetation'))
  })

  it('lowers plant cover when land is cleared', () => {
    const intact = simulateNature({ ...natureDefaults, cleared: 0 })
    const cleared = simulateNature({ ...natureDefaults, cleared: 50 })
    expect(get(cleared, 'vegetation')).toBeLessThan(get(intact, 'vegetation'))
  })

  it('keeps every metric inside its range at the extremes', () => {
    const cases = [
      { rainfall: 40, predators: 0, cleared: 60 },
      { rainfall: 160, predators: 20, cleared: 0 },
      { rainfall: 160, predators: 0, cleared: 0 },
    ]
    for (const input of cases) {
      const result = simulateNature(input)
      for (const m of result.metrics) {
        expect(m.value).toBeGreaterThanOrEqual(0)
        if (m.id !== 'herbivores') expect(m.value).toBeLessThanOrEqual(100)
      }
    }
  })

  it('survives missing or bad input', () => {
    const result = simulateNature({ rainfall: NaN, predators: -5 })
    expect(result.metrics).toHaveLength(3)
    for (const m of result.metrics) expect(Number.isFinite(m.value)).toBe(true)
    expect(simulateNature(undefined).metrics).toHaveLength(3)
  })

  it('reports the plant cover the land could support before grazing', () => {
    expect(simulateNature(natureDefaults).potential).toBe(81)
    const none = simulateNature({ ...natureDefaults, predators: 0 })
    expect(none.potential).toBe(81)
    expect(get(none, 'vegetation')).toBeLessThan(none.potential)
  })
})