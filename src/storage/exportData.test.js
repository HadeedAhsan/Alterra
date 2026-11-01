import { describe, it, expect } from 'vitest'
import { buildExport } from './exportData'

const sample = [
  { id: 'a', name: 'Less cars', worldId: 'city', values: { carUse: 30 }, savedAt: '2026-10-12T10:00:00.000Z' },
]

describe('buildExport', () => {
  it('wraps experiments with app info', () => {
    const data = buildExport(sample)
    expect(data.app).toBe('Alterra')
    expect(data.version).toBe(1)
    expect(data.experiments).toEqual(sample)
  })

  it('includes a valid timestamp', () => {
    const data = buildExport([])
    expect(Number.isNaN(Date.parse(data.exportedAt))).toBe(false)
  })
})