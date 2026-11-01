import { describe, it, expect } from 'vitest'
import { simulateTime, timeDefaults } from './model'

const get = (result, id) => result.metrics.find((m) => m.id === id).value

describe('simulateTime', () => {
  it('gives the expected numbers for the defaults', () => {
    const result = simulateTime(timeDefaults)
    expect(get(result, 'free')).toBe(7.5)
    expect(get(result, 'energy')).toBe(77)
    expect(get(result, 'output')).toBe(5.2)
  })

  it('goes negative and reports overbooked when the day is too full', () => {
    const result = simulateTime({ sleep: 10, work: 14, exercise: 3 })
    expect(get(result, 'free')).toBe(-6)
    expect(result.overbooked).toBe(true)
    expect(result.metrics.find((m) => m.id === 'free').statusLabel).toBe('Overbooked')
  })

  it('lowers energy when sleep drops', () => {
    const rested = simulateTime({ ...timeDefaults, sleep: 8 })
    const tired = simulateTime({ ...timeDefaults, sleep: 5 })
    expect(get(tired, 'energy')).toBeLessThan(get(rested, 'energy'))
  })

  it('hurts more to sleep 2 hours too little than 2 hours too much', () => {
    const short = simulateTime({ ...timeDefaults, sleep: 6 })
    const long = simulateTime({ ...timeDefaults, sleep: 10 })
    expect(get(short, 'energy')).toBeLessThan(get(long, 'energy'))
  })

  it('raises energy with exercise', () => {
    const none = simulateTime({ ...timeDefaults, exercise: 0 })
    const some = simulateTime({ ...timeDefaults, exercise: 1 })
    expect(get(some, 'energy')).toBeGreaterThan(get(none, 'energy'))
  })

  it('gives little extra output for work past 8 hours', () => {
    const eight = simulateTime({ ...timeDefaults, work: 8 })
    const twelve = simulateTime({ ...timeDefaults, work: 12 })
    expect(get(twelve, 'energy')).toBeLessThan(get(eight, 'energy'))
    expect(get(twelve, 'output')).toBeLessThan(get(eight, 'output') * 1.2)
  })

  it('does not reward overworking', () => {
    const base = { sleep: 8, exercise: 1 }
    const eight = simulateTime({ ...base, work: 8 })
    const fourteen = simulateTime({ ...base, work: 14 })
    expect(get(fourteen, 'output')).toBeLessThanOrEqual(get(eight, 'output'))
  })

  it('adds a stress cost once the day is overbooked', () => {
    const full = simulateTime({ sleep: 8, work: 12, exercise: 1 })
    const over = simulateTime({ sleep: 8, work: 14, exercise: 1 })
    expect(full.overbooked).toBe(false)
    expect(over.overbooked).toBe(true)
    // Two extra work hours drain 20 energy, overbooking adds 8 more.
    expect(get(full, 'energy') - get(over, 'energy')).toBe(28)
  })

  it('keeps energy between 0 and 100', () => {
    const best = simulateTime({ sleep: 8, work: 6, exercise: 3 })
    const worst = simulateTime({ sleep: 4, work: 14, exercise: 0 })
    expect(get(best, 'energy')).toBe(100)
    expect(get(worst, 'energy')).toBeGreaterThanOrEqual(0)
  })

  it('survives missing or bad input', () => {
    const result = simulateTime({ sleep: NaN, work: -5 })
    expect(result.metrics).toHaveLength(3)
    for (const m of result.metrics) expect(Number.isFinite(m.value)).toBe(true)
    expect(simulateTime(undefined).metrics).toHaveLength(3)
  })
})