import { describe, it, expect } from 'vitest'
import { simulations } from './registry'

describe.each(Object.entries(simulations))('%s simulation', (id, sim) => {
  it('has a default for every variable', () => {
    for (const v of sim.variables) {
      expect(sim.defaults[v.id]).toBe(v.default)
    }
  })

  it('returns metrics and a summary for its defaults', () => {
    const result = sim.simulate(sim.defaults)
    expect(result.metrics.length).toBeGreaterThan(0)
    expect(typeof result.summary).toBe('string')
  })
})