import { describe, it, expect } from 'vitest'
import { compareScenarios } from './compare'
import { cityVariables, cityDefaults, simulateCity } from './city/model'

const make = (values) => ({ values, result: simulateCity(values) })

describe('compareScenarios', () => {
  it('rounds away floating point noise', () => {
    const metric = (value) => ({ id: 'output', label: 'Output', unit: 'hrs', value })
    const base = { values: {}, result: { metrics: [metric(6.9)] } }
    const alt = { values: {}, result: { metrics: [metric(6.2)] } }
    const { metricChanges } = compareScenarios(base, alt, [])
    expect(metricChanges[0].delta).toBe(-0.7)
  })
  it('lists only the variables that changed', () => {
    const base = make(cityDefaults)
    const alt = make({ ...cityDefaults, carUse: 30 })
    const { changedVariables } = compareScenarios(base, alt, cityVariables)
    expect(changedVariables).toHaveLength(1)
    expect(changedVariables[0]).toMatchObject({ id: 'carUse', from: 60, to: 30 })
  })

  it('reports the change in each metric', () => {
    const base = make(cityDefaults)
    const alt = make({ ...cityDefaults, carUse: 30 })
    const { metricChanges } = compareScenarios(base, alt, cityVariables)
    const congestion = metricChanges.find((m) => m.id === 'congestion')
    expect(congestion.delta).toBe(congestion.to - congestion.from)
    expect(congestion.delta).toBeLessThan(0)
  })

  it('shows no changes for identical scenarios', () => {
    const base = make(cityDefaults)
    const { changedVariables } = compareScenarios(base, base, cityVariables)
    expect(changedVariables).toHaveLength(0)
  })
})