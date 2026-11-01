import { describe, it, expect } from 'vitest'
import { simulateCity, cityDefaults } from './model'

const get = (result, id) => result.metrics.find((m) => m.id === id).value

describe('simulateCity', () => {
  it('gives the expected numbers for the defaults', () => {
    const result = simulateCity(cityDefaults)
    expect(get(result, 'commute')).toBe(28)
    expect(get(result, 'congestion')).toBe(80)
    expect(get(result, 'ridership')).toBe(25)
  })

  it('raises congestion when population grows', () => {
    const small = simulateCity({ ...cityDefaults, population: 100 })
    const large = simulateCity({ ...cityDefaults, population: 200 })
    expect(get(large, 'congestion')).toBeGreaterThan(get(small, 'congestion'))
  })

  it('raises ridership when transit runs more often', () => {
    const rare = simulateCity({ ...cityDefaults, transitFrequency: 1 })
    const often = simulateCity({ ...cityDefaults, transitFrequency: 8 })
    expect(get(often, 'ridership')).toBeGreaterThan(get(rare, 'ridership'))
  })

  it('never goes past 100 percent congestion', () => {
    const result = simulateCity({ population: 500, carUse: 90, transitFrequency: 0.5 })
    expect(get(result, 'congestion')).toBe(100)
  })
    it('falls back to defaults for missing or invalid values', () => {
    expect(simulateCity({})).toEqual(simulateCity(cityDefaults))
    expect(simulateCity({ population: 'abc', carUse: NaN, transitFrequency: null })).toEqual(
      simulateCity(cityDefaults)
    )
  })

  it('clamps out of range values to the slider limits', () => {
  const wild = simulateCity({ population: 9999, carUse: 500, transitFrequency: -5 })
  const limits = simulateCity({ population: 500, carUse: 90, transitFrequency: 0.5 })
  expect(wild).toEqual(limits)
  })
})